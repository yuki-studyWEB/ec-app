import * as Actions from './actions'
import initialState from '../store/initialState'
//actionsファイル内のモジュールは全てActionsという名でimport

//第一引数にstate（現在のstoreの状態、ただし初回はinitialState.usersを受け取る）、第二引数にactionがreturnした値。
export const ProductsReducer = (state = initialState.products, action) => {
    switch (action.type) {

            
        default:
            return state
    }
}