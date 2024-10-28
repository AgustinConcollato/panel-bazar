import { categories } from "./categoriesApi";
import { products } from "./productsApi";

export const api = {
    products,
    categories,
}

export const url = new URL('http://localhost:8000/api')
export const urlStorage = new URL('http://localhost:8000/storage')
export const urlProducts = new URL('http://localhost:8000/api/products')
export const urlCategories = new URL('http://localhost:8000/api/categories')