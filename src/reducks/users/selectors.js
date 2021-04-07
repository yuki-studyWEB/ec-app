import { createSelector } from 'reselect'
// Selectorによりstateの中から自分が参照したいstateだけを抜き出して取得してくれる。
// さらにstateが実際に変化する度にコンポーネント側でも再取得してくれるというメリットもある。
const userSelector = (state) => state.users
//sotreのusersのオブジェクトを取り出す

export const getUserData = createSelector([userSelector], (state) => state)

export const getIsSignedIn = createSelector([userSelector], (state) => state.isSignedIn)

export const getOrdersHistory = createSelector([userSelector], (state) => state.orders)

export const getFavoriteProducts = createSelector([userSelector], (state) => state.favorites)

export const getProductsInCart = createSelector([userSelector], (state) => state.cart)

export const getUserId = createSelector([userSelector], (state) => state.uid)
export const getUserEmail = createSelector([userSelector], (state) => state.email)
export const getUsername = createSelector([userSelector], (state) => state.username)
