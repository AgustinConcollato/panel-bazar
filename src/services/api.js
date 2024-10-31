import { Categories } from "./categoriesApi";
import { Products } from "./productsApi";

export const api = {
    Products,
    Categories,
}

export const url = new URL('http://localhost:8000/api')
export const urlStorage = new URL('http://localhost:8000/storage')
export const urlProducts = new URL(url + '/products')
export const urlCategories = new URL(url + '/categories')