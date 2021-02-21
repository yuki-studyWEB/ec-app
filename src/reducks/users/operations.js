//redux-thunk使う意味・・・主にはactions、 action creators、 componentsが「直接的に」データに影響を起こさせないようにするため。
import {signInAction, signOutAction} from "./actions"
import {push} from 'connected-react-router'
import {auth, db, FirebaseTimestamp} from '../../firebase/index'
//actionsと連動させる。

export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged(user => {
            if(user) { //auth.onAuthStateChanged Firebaseの認証状態チェック
                const uid = user.uid

                db.collection('users').doc(uid).get()
                    .then(snapshot => {
                        const data = snapshot.data() //DBから入手したデータが入っている。

                        dispatch(signInAction({
                            isSignedIn: true,
                            role: data.role,
                            uid: uid,
                            username: data.username
                        }))

                    })
            } else {
                dispatch(push('/signin'))
            }
        })
    }
}

export const resetPassword = (email) => {
    return async (dispatch) => {
        if(email === "") {
            alert("メールアドレスを入力してください")
            return false
        } else {
            auth.sendPasswordResetEmail(email)
                .then(()=>{
                    alert('入力されたアドレスにパスワードリセット用のメールをお送りしました。')
                    dispatch(push('/signin'))
                }).catch(()=>{
                    alert('通信エラー')
                })
        }
    }
}

export const signIn = (email, password) => {
    return async (dispatch) => {
        //バリデーション
        if (email==="" || password===""){
            alert("必須項目が未入力")
            return false
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user

                if(user) {
                    const uid = user.uid

                    db.collection('users').doc(uid).get()
                        .then(snapshot => {
                            const data = snapshot.data() //DBから入手したデータが入っている。

                            dispatch(signInAction({
                                isSignedIn: true,
                                role: data.role,
                                uid: uid,
                                username: data.username
                            }))

                            dispatch(push('/'))
                        })
                }
            })
    }
}
//非同期処理（async,await）を使わないと、全てのデータを取得する前に処理が流れ、Viewに反映されてしまう。

export const signUp = (username, email, password,confirmPassword) => {
    return async (dispatch) => {
        //バリデーション
        if (username === "" || email==="" || password==="" || confirmPassword===""){
            alert("必須項目が未入力")
            return false
        }
        if(password !== confirmPassword) {
            alert("パスワードが一致してません")
            return false
        }
        //↓emailpassword認証用のユーザーを作るメソッド、入力したemailとpasswordを引数に認証ユーザーが作成される。
        return auth.createUserWithEmailAndPassword(email,password)
            .then(result => {
                console.log(result)
                const user =result.user
                if(user){
                    const uid = user.uid
                    const timestamp = FirebaseTimestamp.now() //FirebaseTimestamp.now()で現在のサーバー時刻を取得
                    const userInitialData = {
                        created_at: timestamp,
                        email: email,
                        role: "customer",
                        uid: uid,
                        updated_at: timestamp,
                        username: username
                    }
                    //auth認証作成完了後、dbのusersコレクションに新規情報を登録
                    db.collection('users').doc(uid).set(userInitialData)
                        .then(() => {
                            dispatch(push('/'))//dispatch(push())　ルーターのパス変更
                        })
                } //doc(uid) idをfirebaseのAuthenticationで管理しているuidと一致させた方が管理しやすい。
            })
    }
}

export const signOut = () => {
    return async (dispatch) => {
        auth.signOut()
            .then(()=>{
                dispatch(signOutAction());
                dispatch(push('/signin'));
            })
    }
}