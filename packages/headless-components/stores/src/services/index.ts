export {
  CategoryService,
  CategoryServiceDefinition,
  loadCategoryServiceConfig,
  CategoryServiceConfig,
  Category,
} from "./category-service.js";

export {
  CategoriesListService,
  CategoriesListServiceDefinition,
  loadCategoriesListServiceConfig,
  CategoriesListServiceConfig,
} from "./categories-list-service.js";

export {
  ProductModifiersService,
  ProductModifiersServiceDefinition,
} from "./product-modifiers-service.js";

export {
  ProductService,
  ProductServiceDefinition,
  loadProductServiceConfig,
} from "./product-service.js";

export {
  SelectedVariantService,
  SelectedVariantServiceDefinition,
} from "./selected-variant-service.js";

export {
  ProductListService,
  ProductsListServiceDefinition,
  loadProductsListServiceConfig,
  ProductsListServiceConfig,
} from "./products-list-service.js";

// New consolidated search service
export {
  SortType,
  InventoryStatusType,
  ProductOption,
  ProductChoice,
  ProductsListSearchService,
  ProductsListSearchServiceDefinition,
  ProductsListSearchServiceConfig,
  loadProductsListSearchServiceConfig,
  parseUrlForProductsListSearch,
  convertUrlSortToSortType,
} from "./products-list-search-service.js";
