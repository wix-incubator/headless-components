import React from "react";
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
} from "@wix/headless-stores/services";
import {
  createServicesMap,
  createServicesManager,
} from "@wix/services-manager";

// --- MOCK DATA (replace with real data/fetch in production) ---
const MOCK_PRODUCT = {
  title: "I'm a product",
  sku: "364215376135191",
  price: 85,
  description:
    "I'm a product description. I'm a great place to add more details about your product such as sizing, material, care instructions and cleaning instructions.",
};
const MOCK_VARIANTS = [
  {
    id: "v1",
    label: "Red / S",
    stock: 5,
    ribbon: "Best Seller",
    isPreOrder: false,
  },
  { id: "v2", label: "Red / M", stock: 2, ribbon: null, isPreOrder: false },
  { id: "v3", label: "Blue / S", stock: 0, ribbon: null, isPreOrder: true },
];
const MOCK_OPTIONS = {
  color: ["Red", "Blue"],
  size: ["S", "M"],
};
const MOCK_IMAGES = [
  "https://dummyimage.com/600x600/ff4444/fff&text=Red+S",
  "https://dummyimage.com/600x600/ff4444/fff&text=Red+M",
  "https://dummyimage.com/600x600/4444ff/fff&text=Blue+S",
];
const MOCK_VARIANT_IMAGE_MAP = {
  v1: 0,
  v2: 1,
  v3: 2,
};

// --- Service Instances (in real app, use context/provider pattern) ---
const servicesMap = createServicesMap()
  .addService(variantSelectorServiceDefinition, variantSelectorService)
  .addService(productGalleryServiceDefinition, productGalleryService)
  .addService(currentCartServiceDefinition, currentCartService)
  .addService(wishlistServiceDefinition, wishlistService);
const servicesManager = createServicesManager(servicesMap);
const variantSelector = servicesManager.getService(
  variantSelectorServiceDefinition
);
const productGallery = servicesManager.getService(
  productGalleryServiceDefinition
);
const currentCart = servicesManager.getService(currentCartServiceDefinition);
const wishlist = servicesManager.getService(wishlistServiceDefinition);

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
  const sku = variantSelector.sku.get();
  const ribbon = variantSelector.ribbonLabel.get() || selectedVariant.ribbon;
  const isPreOrder = selectedVariant.isPreOrder;

  // --- Gallery ---
  const images = productGallery.images.get();
  const selectedImageIndex = productGallery.selectedImageIndex.get();
  const currentImage = productGallery.currentImage();
  // Map variant to image
  const handleVariantImage = (variantId) => {
    const idx = productGallery.variantMappedImage(variantId);
    productGallery.setImageIndex(idx);
  };

  // --- Cart & Wishlist ---
  const cartItems = currentCart.items.get();
  const wishlistItems = wishlist.wishlist.get();
  const inWishlist = wishlist.isInWishlist(
    variantSelector.productId.get(),
    selectedVariant.id
  );

  // --- Handlers ---
  const handleOptionChange = (group, value) => {
    variantSelector.setOption(group, value);
    // Optionally sync image
    handleVariantImage(variantSelector.selectedVariant().id);
  };
  const handleAddToCart = () => {
    currentCart.addItem(
      variantSelector.productId.get(),
      selectedVariant.id,
      quantity.value
    );
    // Print current items in cart
    console.log("Current cart items:", currentCart.items.get());
  };
  const handleBuyNow = () => {
    currentCart.buyNow(
      variantSelector.productId.get(),
      selectedVariant.id,
      quantity.value
    );
  };
  const handleWishlistToggle = () => {
    wishlist.toggleWishlist(
      variantSelector.productId.get(),
      selectedVariant.id
    );
  };
  const handleQuantityChange = (e) => {
    const val = Math.max(
      1,
      Math.min(Number(e.target.value), selectedVariant.stock)
    );
    quantity.value = val;
  };

  // --- UI ---
  return (
    <div className="product-page-wixstudio">
      <div className="main-section">
        <div className="image-section">
          <img src={currentImage} alt="Product" className="main-image" />
          <div className="thumbnails">
            {images.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt={`thumb-${idx}`}
                className={`thumb ${
                  idx === selectedImageIndex ? "selected" : ""
                }`}
                onClick={() => productGallery.setImageIndex(idx)}
              />
            ))}
          </div>
        </div>
        <div className="details-section">
          <h1 className="product-title">{MOCK_PRODUCT.title}</h1>
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
          <div className="desc">{MOCK_PRODUCT.description}</div>
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
              max={selectedVariant.stock}
              value={quantity.value}
              onChange={handleQuantityChange}
              className="qty-input"
            />
          </div>
          <div className="actions-row">
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.stock < 1}
              className="primary-btn"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={selectedVariant.stock < 1}
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
