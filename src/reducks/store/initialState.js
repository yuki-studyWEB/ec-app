const initialState = {
    products:{
        list:[],
        searchResult: []
    },
    users: {
        cart: [], //サブコレクション"cart""
        favorites: [],
        isSignedIn: false,
        orders: [],
        role: "",
        uid: "",
        email: "",
        username: "",
        fullName: "",
        fullNameKana: "",
        fullPostCode: "",
        fulladdress: "",
        tel: ""
    }
}; //initialStateではアプリに必要なstateを全て記述しておくこと。

export default initialState