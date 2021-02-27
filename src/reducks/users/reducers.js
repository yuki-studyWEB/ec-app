import * as Actions from './actions'
import initialState from '../store/initialState'
//actionsファイル内のモジュールは全てActionsという名でimport

//第一引数にstate（現在のstoreの状態、ただし初回はinitialState.usersを受け取る）、第二引数にactionがreturnした値。
export const UsersReducer = (state = initialState.users, action) => {
    switch (action.type) {
        case Actions.FETCH_ORDERS_HISTORY:
            return{
                ...state,
                orders:[...action.payload]
            }
        case Actions.FETCH_PRODUCTS_IN_CART:
            return{
                ...state,
                cart:[...action.payload]
            }
        case Actions.SIGN_IN:
            return{
                ...state,
                ...action.payload //isSingnedIn:action.payload.isSignedIn,uid: action.payload.uid,username: action.payload.usernameをまとめてあげれる。
            }
            //reducersはstoreの状態を上書きしてしまう。指定されていないフィールドがあった場合そのフィールドは無くなってしまう。
            //これを解決するため、...stateを書いてあげることで、状態を維持することができる。
            // {...A,...B}でAとBのオブジェクトをマージすることができる！
        case Actions.SIGN_OUT:
            return{
                ...state,
                ...action.payload
            }
            
        default:
            return state
    }// つまり初期化時は↑のdefaultの箇所が返される。
}