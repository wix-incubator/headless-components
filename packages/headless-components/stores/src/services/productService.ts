import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";

// Types (reuse from variantSelectorService or App.jsx)
interface OptionChoiceNames {
  optionName: string;
  choiceName: string;
}
interface Variant {
  _id: string;
  visible: boolean;
  sku: string;
  choices: { optionChoiceNames: OptionChoiceNames }[];
  price: { actualPrice: { amount: string; formattedAmount: string } };
  inventoryStatus: { inStock: boolean; preorderEnabled: boolean };
}
interface Option {
  name: string;
  choicesSettings: { choices: { name: string; choiceId: string }[] };
}
interface Product {
  _id: string;
  name: string;
  sku: string;
  handle: string;
  slug: string;
  visible: boolean;
  productType: string;
  plainDescription: string;
  description: any;
  options: Option[];
  variantsInfo: { variants: Variant[] };
  media: { itemsInfo: { items: { url: string; image: string }[] } };
}

// Mock product data (copy from App.jsx)
const MOCK_PRODUCT: Product = {
  _id: "p1",
  name: "I'm a product",
  sku: "364215376135191",
  handle: "im-a-product",
  slug: "im-a-product",
  visible: true,
  productType: "PHYSICAL",
  plainDescription:
    "I'm a product description. I'm a great place to add more details about your product such as sizing, material, care instructions and cleaning instructions.",
  description: { nodes: [], metadata: {}, documentStyle: {} },
  options: [
    {
      name: "color",
      choicesSettings: {
        choices: [
          { name: "blue", choiceId: "c1" },
          { name: "red", choiceId: "c2" },
        ],
      },
    },
    {
      name: "size",
      choicesSettings: {
        choices: [
          { name: "S", choiceId: "s1" },
          { name: "M", choiceId: "s2" },
          { name: "L", choiceId: "s3" },
        ],
      },
    },
  ],
  variantsInfo: {
    variants: [
      {
        _id: "v1",
        visible: true,
        sku: "364215376135191",
        choices: [
          { optionChoiceNames: { optionName: "color", choiceName: "blue" } },
          { optionChoiceNames: { optionName: "size", choiceName: "S" } },
        ],
        price: { actualPrice: { amount: "100", formattedAmount: "$100" } },
        inventoryStatus: { inStock: true, preorderEnabled: false },
      },
      {
        _id: "v2",
        visible: true,
        sku: "364215376135191",
        choices: [
          { optionChoiceNames: { optionName: "color", choiceName: "blue" } },
          { optionChoiceNames: { optionName: "size", choiceName: "M" } },
        ],
        price: { actualPrice: { amount: "105", formattedAmount: "$105" } },
        inventoryStatus: { inStock: true, preorderEnabled: false },
      },
      {
        _id: "v3",
        visible: false,
        sku: "364215376135191",
        choices: [
          { optionChoiceNames: { optionName: "color", choiceName: "blue" } },
          { optionChoiceNames: { optionName: "size", choiceName: "L" } },
        ],
        price: { actualPrice: { amount: "110", formattedAmount: "$110" } },
        inventoryStatus: { inStock: false, preorderEnabled: true },
      },
      {
        _id: "v4",
        visible: true,
        sku: "364215376135191",
        choices: [
          { optionChoiceNames: { optionName: "color", choiceName: "red" } },
          { optionChoiceNames: { optionName: "size", choiceName: "S" } },
        ],
        price: { actualPrice: { amount: "100", formattedAmount: "$100" } },
        inventoryStatus: { inStock: true, preorderEnabled: false },
      },
      {
        _id: "v5",
        visible: true,
        sku: "364215376135191",
        choices: [
          { optionChoiceNames: { optionName: "color", choiceName: "red" } },
          { optionChoiceNames: { optionName: "size", choiceName: "M" } },
        ],
        price: { actualPrice: { amount: "105", formattedAmount: "$105" } },
        inventoryStatus: { inStock: true, preorderEnabled: false },
      },
      {
        _id: "v6",
        visible: true,
        sku: "364215376135191",
        choices: [
          { optionChoiceNames: { optionName: "color", choiceName: "red" } },
          { optionChoiceNames: { optionName: "size", choiceName: "L" } },
        ],
        price: { actualPrice: { amount: "110", formattedAmount: "$110" } },
        inventoryStatus: { inStock: true, preorderEnabled: false },
      },
    ],
  },
  media: {
    itemsInfo: {
      items: [
        {
          url: "https://dummyimage.com/600x600/0000ff/fff&text=Blue+S",
          image: "https://dummyimage.com/600x600/0000ff/fff&text=Blue+S",
        },
        {
          url: "https://dummyimage.com/600x600/0000ff/fff&text=Blue+M",
          image: "https://dummyimage.com/600x600/0000ff/fff&text=Blue+M",
        },
        {
          url: "https://dummyimage.com/600x600/0000ff/fff&text=Blue+L",
          image: "https://dummyimage.com/600x600/0000ff/fff&text=Blue+L",
        },
        {
          url: "https://dummyimage.com/600x600/ff4444/fff&text=Red+S",
          image: "https://dummyimage.com/600x600/ff4444/fff&text=Red+S",
        },
        {
          url: "https://dummyimage.com/600x600/ff4444/fff&text=Red+M",
          image: "https://dummyimage.com/600x600/ff4444/fff&text=Red+M",
        },
        {
          url: "https://dummyimage.com/600x600/ff4444/fff&text=Red+L",
          image: "https://dummyimage.com/600x600/ff4444/fff&text=Red+L",
        },
      ],
    },
  },
};

export const productServiceDefinition = defineService<{
  getProduct: () => Product;
}>("productService");

export const productService = implementService(productServiceDefinition, () => {
  return {
    getProduct: () => MOCK_PRODUCT,
  };
});
