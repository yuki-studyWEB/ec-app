import {
    createStore as reduxCreateStore,
    combineReducers,
    applyMiddleware
} from 'redux'
// reduxのパッケージから、creatStoreとcombineReducersいうモジュールをインポート。
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from 'redux-thunk'

import {ProductsReducer} from "../products/reducers";
import {UsersReducer} from "../users/reducers";

export default function createStore(history) {
    return reduxCreateStore(
        combineReducers({
            router: connectRouter(history), // historyはパスの情報等
            users: UsersReducer,
            products: ProductsReducer
        }),// combineReducersでstateを作成
        //　アプリが大きくなった時にreducersを分割することがあるが、その分割したReducersを一つにまとめて、大きなオブジェクト(stateのデータ構造と同じ)としてreturnしてあげる。
        applyMiddleware(
            routerMiddleware(history),
            thunk
        )// routerをmiddlewareとして使いますという宣言
    )
}
