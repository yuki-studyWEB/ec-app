const initialState = {
    products:{
        list:[]
    },
    users: {
        cart: [], //サブコレクション"cart""
        isSignedIn: false,
        orders: [],
        role: "",
        uid: "",
        username: ""
    }
}; //initialStateではアプリに必要なstateを全て記述しておくこと。

export default initialState