enum Pages {
  MAIN = '/',
  MEALS = '/meals',
  MEAL = '/meals/:id',
  PRODUCTS = '/products',
  PRODUCTS_BY_CATEGORY = '/products?category=',
  LOGIN = '/login',
  REGISTRATION = '/sign-up',
}

enum ProtectedPages {
  MEALS_AVAILABLE_FOR_USER = '/meals/available',
  CREATE_MEAL_CATEGORY = '/meals/category/new',
  CREATE_MEAL = '/meals/new',
  CREATE_PRODUCT_CATEGORY = '/products/category/new',
  CREATE_PRODUCT = '/products/new',
  PROFILE = '/profile',
}

export { Pages, ProtectedPages };
