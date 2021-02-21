export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState) => {
    return {
        type: "SIGN_IN",
        payload:{
            isSignedIn: true,
            role: userState.role,
            uid: userState.uid,
            username: userState.username
        }
    } //Reducerに渡すのはプレーンなデータだけ。関数など入れない。
}; //actionsのオブジェクトは必ずexportしてあげる。

export const SIGN_OUT = "SIGN_OUT";
export const signOutAction = () => {
    return {
        type: "SIGN_OUT",
        payload:{
            isSignedIn: false,
            role: "",
            uid: "",
            username: ""
        }
    }
}; //なぜ引数を受け取らないかというと、ユーザーがサインアウトするときはユーザーの情報を初期の状態に戻せば良いだけだから。