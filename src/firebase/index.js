import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import {firebaseConfig} from "./config";

firebase.initializeApp(firebaseConfig);
//firabaseConfigの設定を使って、firebaseのアプリケーションを初期化します。→reactアプリの中でfirebaseのサービスが使えるようになる。
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const FirebaseTimestamp = firebase.firestore.Timestamp; //データの作成日時等を記録してくれる。
//各firebaseのサービスのメソッドを定数に入れてexport

export default firebase;