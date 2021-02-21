const initialState = {
    products:{
        lists:[]
    },
    users: {
        isSignedIn: false,
        role: "",
        uid: "",
        username: ""
    }
}; //initialStateではアプリに必要なstateを全て記述しておくこと。

export default initialState