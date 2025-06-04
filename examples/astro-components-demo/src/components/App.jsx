import React, { useEffect } from "react";
import "./App.css";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
// Import the headless service definitions
import {
  variantSelectorServiceDefinition,
  productGalleryServiceDefinition,
  currentCartServiceDefinition,
  variantSelectorService,
  productGalleryService,
  currentCartService,
  wishlistServiceDefinition,
  wishlistService,
  productService,
  productServiceDefinition,
} from "@wix/headless-stores/services";
import {
  createServicesMap,
  createServicesManager,
} from "@wix/services-manager";

// --- Service Instances (in real app, use context/provider pattern) ---
const servicesMap = createServicesMap()
  .addService(variantSelectorServiceDefinition, variantSelectorService)
  .addService(productGalleryServiceDefinition, productGalleryService)
  .addService(currentCartServiceDefinition, currentCartService)
  .addService(wishlistServiceDefinition, wishlistService)
  .addService(productServiceDefinition, productService);
const servicesManager = createServicesManager(servicesMap);
const variantSelector = servicesManager.getService(
  variantSelectorServiceDefinition
);
const productGallery = servicesManager.getService(
  productGalleryServiceDefinition
);
const currentCart = servicesManager.getService(currentCartServiceDefinition);
const wishlist = servicesManager.getService(wishlistServiceDefinition);
const product = servicesManager.getService(productServiceDefinition);

const PRODUCT_DATA = product.getProduct();
const MOCK_PRODUCT = PRODUCT_DATA;
const MOCK_VARIANTS = PRODUCT_DATA.variantsInfo.variants;
const MOCK_OPTIONS = Object.fromEntries(
  (PRODUCT_DATA.options || []).map((opt) => [
    opt.name,
    (opt.choicesSettings?.choices || []).map((c) => c.name),
  ])
);
const MOCK_IMAGES = PRODUCT_DATA.media.itemsInfo.items.map(
  (item) => item.image
);
const MOCK_VARIANT_IMAGE_MAP = {
  v1: 0,
  v2: 1,
  v3: 2,
  v4: 3,
  v5: 4,
  v6: 5,
};

// Load initial data
variantSelector.loadProductVariants(MOCK_VARIANTS);
variantSelector.options.set(MOCK_OPTIONS);
productGallery.loadImages(MOCK_IMAGES);
productGallery.variantImageMap.set(MOCK_VARIANT_IMAGE_MAP);

const quantity = signal(1);

function ProductPage() {
  useSignals();

  // --- Variant Selection ---
  const options = variantSelector.options.get();
  const selectedOptions = variantSelector.selectedOptions.get();
  const variants = variantSelector.variants.get();
  const selectedVariant = variantSelector.selectedVariant();
  const isLowStock = variantSelector.isLowStock(3); // threshold=3
  const finalPrice = variantSelector.finalPrice() || MOCK_PRODUCT.price;
  const basePrice = variantSelector.basePrice.get();
  const discountPrice = variantSelector.discountPrice.get();
  const isOnSale = variantSelector.isOnSale.get();
  const sku = selectedVariant.sku;
  const ribbon = variantSelector.ribbonLabel.get();
  const isPreOrder = selectedVariant.inventoryStatus?.preorderEnabled;

  // --- Gallery ---
  const images = productGallery.images.get();
  const variantImageMap = productGallery.variantImageMap.get();
  const mappedIdx = variantImageMap[selectedVariant._id];
  const currentImage =
    typeof mappedIdx === "number" ? images[mappedIdx] : images[0];

  // --- Cart & Wishlist ---
  const cartItems = currentCart.items.get();
  const wishlistItems = wishlist.wishlist.get();
  const inWishlist = wishlist.isInWishlist(
    variantSelector.productId.get(),
    selectedVariant._id
  );

  // --- Handlers ---
  const handleOptionChange = (group, value) => {
    variantSelector.setOption(group, value);
    // After the variant is updated, update the gallery image to match the new selected variant
    const newSelectedVariant = variantSelector.selectedVariant();
    const newMappedIdx =
      productGallery.variantImageMap.get()[newSelectedVariant._id];
    if (typeof newMappedIdx === "number") {
      productGallery.setImageIndex(newMappedIdx);
    }
  };
  const handleAddToCart = () => {
    currentCart.addItem(
      variantSelector.productId.get(),
      selectedVariant._id,
      quantity.value
    );
    // Print current items in cart
    console.log("Current cart items:", currentCart.items.get());
  };
  const handleBuyNow = () => {
    currentCart.buyNow(
      variantSelector.productId.get(),
      selectedVariant._id,
      quantity.value
    );
  };
  const handleWishlistToggle = () => {
    wishlist.toggleWishlist(
      variantSelector.productId.get(),
      selectedVariant._id
    );
  };
  const handleQuantityChange = (e) => {
    // Find the selected option's stock (if available)
    // For demo, fallback to 99 if not found
    const maxQty = selectedVariant.inventoryStatus?.inStock ? 99 : 0;
    const val = Math.max(1, Math.min(Number(e.target.value), maxQty));
    quantity.value = val;
  };

  // --- UI ---
  return (
    <div className="product-page-wixstudio">
      <div className="main-section">
        <div className="image-section">
          <img src={currentImage} alt="Product" className="main-image" />
          <div className="thumbnails">
            {images.map((img, idx) => {
              // Find the variant id mapped to this image index
              const variantId = Object.keys(variantImageMap).find(
                (vid) => variantImageMap[vid] === idx
              );
              return (
                <img
                  key={img}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`thumb ${idx === mappedIdx ? "selected" : ""}`}
                  style={{ cursor: variantId ? "pointer" : "default" }}
                  onClick={() => {
                    if (variantId) {
                      variantSelector.selectVariantById(variantId);
                      // Update selected options (color, size) to match the variant
                      const variant = variants.find((v) => v._id === variantId);
                      if (variant && variant.choices) {
                        variant.choices.forEach((choiceObj) => {
                          const { optionName, choiceName } =
                            choiceObj.optionChoiceNames;
                          variantSelector.setOption(optionName, choiceName);
                        });
                      }
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="details-section">
          <h1 className="product-title">{MOCK_PRODUCT.name}</h1>
          <div className="sku">SKU: {MOCK_PRODUCT.sku}</div>
          <div className="price">
            {isOnSale && discountPrice ? (
              <>
                <span
                  className="base-price"
                  style={{ textDecoration: "line-through", color: "#888" }}
                >
                  ${basePrice}
                </span>
                <span
                  className="discount-price"
                  style={{ color: "#e60023", marginLeft: 8 }}
                >
                  ${discountPrice}
                </span>
              </>
            ) : (
              <span className="final-price">${finalPrice.toFixed(2)}</span>
            )}
          </div>
          {ribbon && <span className="ribbon">{ribbon}</span>}
          <div className="desc">{MOCK_PRODUCT.plainDescription}</div>
          <div className="options">
            {Object.entries(options).map(([group, values]) => {
              console.log({ selectedOptions });
              return (
                <div key={group} className="option-group">
                  <label>{group}:</label>
                  <select
                    value={selectedOptions[group] || ""}
                    onChange={(e) => handleOptionChange(group, e.target.value)}
                  >
                    <option value="">Select {group}</option>
                    {values.map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          <div className="quantity-row">
            <label>Quantity</label>
            <input
              type="number"
              min={1}
              max={selectedVariant.inventoryStatus?.inStock ? 99 : 0}
              value={quantity.value}
              onChange={handleQuantityChange}
              className="qty-input"
            />
          </div>
          <div className="actions-row">
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.inventoryStatus?.inStock < 1}
              className="primary-btn"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={selectedVariant.inventoryStatus?.inStock < 1}
              className="primary-btn"
            >
              Buy Now
            </button>
            <button
              onClick={handleWishlistToggle}
              className={inWishlist ? "wishlisted-btn" : "wishlist-btn"}
            >
              {inWishlist ? "♥ Wishlisted" : "♡ Wishlist"}
            </button>
          </div>
          {isPreOrder && <div className="preorder">Pre-order</div>}
          {isLowStock && <div className="low-stock">Low stock!</div>}
        </div>
      </div>
      <div className="info-sections">
        <div className="info-block">
          <h2>PRODUCT INFO</h2>
          <p>
            I'm a product detail. I'm a great place to add more information
            about your product such as sizing, material, care and cleaning
            instructions. This is also a great space to write what makes this
            product special and how your customers can benefit from this item.
          </p>
        </div>
        <div className="info-block">
          <h2>RETURN & REFUND POLICY</h2>
          <p>
            I'm a Return and Refund policy. I'm a great place to let your
            customers know what to do in case they are dissatisfied with their
            purchase. Having a straightforward refund or exchange policy is a
            great way to build trust and reassure your customers that they can
            buy with confidence.
          </p>
        </div>
        <div className="info-block">
          <h2>SHIPPING INFO</h2>
          <p>
            I'm a shipping policy. I'm a great place to add more information
            about your shipping methods, packaging and cost. Providing
            straightforward information about your shipping policy is a great
            way to build trust and reassure your customers that they can buy
            from you with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
