import {createSelector} from 'reselect';
// Selectorによりstateの中から自分が参照したいstateだけを抜き出して取得してくれる。
// さらにstateが実際に変化する度にコンポーネント側でも再取得してくれるというメリットもある。
const userSelector = (state) => state.users;
//sotreのusersのオブジェクトを取り出す

export const getIsSignedIn = createSelector(
    [userSelector],
    state => state.isSignedIn
)

export const getOrdersHistory = createSelector(
    [userSelector],
    state => state.orders
)

export const getProductsInCart = createSelector(
    [userSelector],
    state => state.cart
)

export const getUserId = createSelector(
    [userSelector],
    state => state.uid
) //第一引数[userSelector]で現在のusersの中身を取得し、第二引数stateがそれを引き継ぐ

export const getUsername = createSelector(
    [userSelector],
    state => state.username
) //第一引数[userSelector]で現在のusersの中身を取得し、第二引数stateがそれを引き継ぐ