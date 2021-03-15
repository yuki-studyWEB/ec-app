//redux-thunk使う意味・・・主にはactions、 action creators、 componentsが「直接的に」データに影響を起こさせないようにするため。
import {signInAction, signOutAction, changeUserDataAction, fetchProductsInCartAction, fetchOrdersHistoryAction, fetchFavoritesAction} from "./actions"
import {push} from 'connected-react-router'
import {auth, db, FirebaseTimestamp} from '../../firebase/index'
//actionsと連動させる。

export const addProductToCart = (addedProduct) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const cartRef = db.collection('users').doc(uid).collection('cart').doc(); //サブコレクションusers/{id}/cart/{id}
        addedProduct['cartId'] = cartRef.id; //今回追加するデータの中にuserのサブコレクションのIDをフィールドとして追加
        await cartRef.set(addedProduct);
        dispatch(push('/cart'))
    }
}
export const addFavoriteProduct = (addedProduct) => {
    return async (dispatch,getState) => {
        const uid = getState().users.uid;
        console.log(uid)
        const favoRef = db.collection('users').doc(uid).collection('favorites').doc(); //サブコレクションusers/{id}/favorites/{id}
        addedProduct['favoriteId'] = favoRef.id; //今回追加するデータの中にuserのサブコレクションのIDをフィールドとして追加
        await favoRef.set(addedProduct);
    }
}

export const fetchOrdersHistory = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = [];

        db.collection('users').doc(uid)
            .collection('orders')
            .orderBy('updated_at', 'desc')
            .get()
            .then((snapshots) => {
                snapshots.forEach(snapshot => {
                    const data = snapshot.data()
                    list.push(data)
                })

                dispatch(fetchOrdersHistoryAction(list));
            })

    }
}
export const fetchFavoriteProducts = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = [];

        db.collection('users').doc(uid)
            .collection('favorites')
            .orderBy('added_at', 'desc')
            .get()
            .then((snapshots) => {
                snapshots.forEach(snapshot => {
                    const data = snapshot.data()
                    list.push(data)
                })

                dispatch(fetchFavoritesAction(list));
            })

    }
}

export const fetchProductsInCart = (products) => {
    return async (dispatch) => {
        dispatch(fetchProductsInCartAction(products))
    }
}

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
                            username: data.username,
                            email: data.email,
                        }))

                    })
            } else {
                dispatch(push('/signin'))
            }
        })
    }
}

//ユーザー登録情報の変更
export const changeUserName = (username,password) => {
    return async (dispatch,getState) => {
        const email = getState().users.email;
        if(username !== ""|| password !==""){

        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user;
                const timestamp = FirebaseTimestamp.now(); //FirebaseTimestamp.now()で現在のサーバー時刻を取得
                const userChangeData = {
                    updated_at: timestamp,
                    username: username
                } //actionにはオブジェクト型を送る必要がある。
                if(user) {
                    const uid = user.uid
                    db.collection('users').doc(uid).set(userChangeData, {merge: true})
                        .then(() => {
                            dispatch(changeUserDataAction(userChangeData));
                            dispatch(push('/user/mypage'))
                        })
                }
            })
            .catch(() => {
                alert('error: パスワードが間違っていないか確認してください')
            });
        } else {
            alert("必須項目を入力してください")
            return false
        }
    }
};

export const changeUserEmail = (userEmail,password) => {
    return async (dispatch,getState) => {
        const email = getState().users.email;
        if(userEmail !== ""|| password !==""){
            if(/[\w\-\._]+@[\w\-\._]+\.[A-Za-z]+/.test(userEmail)){
                auth.signInWithEmailAndPassword(email, password)
                    .then(result => {
                        const user = result.user;
                        const timestamp = FirebaseTimestamp.now();
                        const userChangeData = {
                            updated_at: timestamp,
                            email: userEmail
                        }
                        if(user) {
                            user.updateEmail(userEmail).then(function() {
                                const uid = user.uid
                                db.collection('users').doc(uid).set(userChangeData, {merge: true})
                                    .then(() => {
                                        dispatch(changeUserDataAction(userChangeData));
                                        dispatch(push('/user/mypage'))
                                    })
                            }).catch(function() {
                                alert('error: ネットワーク通信エラー')
                            });
                        }
                    })
                    .catch(() => {
                        alert('error: パスワードが間違っていないか確認してください')
                    });   
            } else {
                alert("有効なメールアドレスではありません。")
                return false
            }
        } else {
            alert("必須項目を入力してください")
            return false
        }
    }
};

export const addUserBaseData = (newUserData,password) => {
    return async (dispatch,getState) => {
        const email = getState().users.email;
        if(newUserData.lastName!==""||newUserData.firstName!==""||newUserData.lastKana!==""||newUserData.firstKana!==""||newUserData.postCodeH!==""||newUserData.postCodeF!==""||newUserData.address1!==""||newUserData.address2!==""||newUserData.address3!==""||password !==""){

        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user

                const fullName = newUserData.lastName + "　" + newUserData.firstName;
                const fullNameKana = newUserData.lastKana + "　" + newUserData.firstKana;
                const fullPostCode = newUserData.postCodeH + "-" + newUserData.postCodeF;
                const fulladdress = newUserData.address1 + "　" + newUserData.address2 + "　" + newUserData.address3;
                const telNumber = (newUserData.tel === "") ? "" : newUserData.tel;
                const timestamp = FirebaseTimestamp.now()
                const userChangeData = {
                    updated_at: timestamp,
                    fullName: fullName,
                    fullNameKana: fullNameKana,
                    fullPostCode: fullPostCode,
                    fulladdress: fulladdress,
                    tel: telNumber
                }
                if(user) {
                    const uid = user.uid
                    db.collection('users').doc(uid).set(userChangeData, {merge: true})
                        .then(() => {
                            dispatch(changeUserDataAction(userChangeData));

                            dispatch(push('/user/mypage'))
                        })
                }
            })
            .catch(() => {
                alert('error: パスワードが間違っていないか確認してください')
            });
        } else {
            alert("必須項目を入力してください")
            return false
        }
    }
};

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
                                username: data.username,
                                email: email
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