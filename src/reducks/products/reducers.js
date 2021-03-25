import * as Actions from './actions'
import initialState from '../store/initialState'
//actionsファイル内のモジュールは全てActionsという名でimport

//第一引数にstate（現在のstoreの状態、ただし初回はinitialState.usersを受け取る）、第二引数にactionがreturnした値。
export const ProductsReducer = (state = initialState.products, action) => {
    switch (action.type) {
        case Actions.DELETE_PRODUCT:
            return{
                ...state,
                list: [...action.payload]
            };
        case Actions.SEARCH_RESULT:
            state.searchResult = [];
            return{
                ...state,
                searchResult: [...action.payload]
            };
        case Actions.FETCH_PRODUCTS:
            state.list = [];
            if(state.list.length === 0){
                return{
                    ...state,
                    list: action.payload
                };
            }
            case Actions.RESET_SEARCH:
            return{
                ...state,
                searchResult: action.payload
            };
            default:
            return state
    }
}