import { Categories } from "./categoriesService"
import { Products } from "./productsService"
import { Auth } from "./authService"
import { Firebase } from "./firebaseService"
import { Order } from "./ordersService"

export const api = {
    Products,
    Categories,
    Auth,
    Firebase,
    Order
}

export const url = new URL('http://localhost:8000/api')
export const urlStorage = new URL('http://localhost:8000/storage')
export const urlProducts = new URL(url + '/products')
export const urlCategories = new URL(url + '/categories')