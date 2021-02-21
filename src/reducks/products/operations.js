import { db, FirebaseTimestamp } from "../../firebase"
import {push} from 'connected-react-router'

const productRef = db.collection('products')

export const saveProduct = (name,description,category,gender,price) => {
    return async (dispatch) => {
        const timestamp = FirebaseTimestamp.now()

        const data = {
            category: category,
            description: description,
            gender: gender,
            name: name,
            price: parseInt(price, 10), //文字列の値を数値に10進数の変換
            updated_at: timestamp
        }

        const ref = productRef.doc();
        const id = ref.id
        data.id = id //dataに自動采配されたid項目を追加
        data.created_at = timestamp //dataに新規作成したサーバー時刻を追加

        return productRef.doc(id).set(data)
            .then(() =>{
                dispatch(push('/'))
            }).catch((error)=>{
                throw new Error(error)
            })
    }
}