import { db, FirebaseTimestamp } from "../../firebase"
import {push} from 'connected-react-router'
import {fetchProductsAction, deleteProductAction} from './actions'

const productsRef = db.collection('products');

export const deleteProduct = (id) => {
    return async (dispatch, getState) => {
        productsRef.doc(id).delete()
            .then(() => {
                const prevProducts = getState().products.list;
                const nextProducts = prevProducts.filter(product => product.id !== id)
                dispatch(deleteProductAction(nextProducts))
            })
    }
}

export const orderProduct = (productsInCart, amount) =>{
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const userRef = db.collection('users').doc(uid);
        const timestamp = FirebaseTimestamp.now();
        let products = [];
        let soldOutProducts = [];

        const batch = db.batch();

        for (const product of productsInCart) {
            const snapshot = await productsRef.doc(product.productId).get()
            const sizes = snapshot.data().sizes;
            const updateSizes = sizes.map(size => {
                if (size.size === product.size){
                    if (size.quantity === 0 ) {
                        soldOutProducts.push(product.name)
                        return size //size: size.size,quantity: size.quantity
                    }
                    return {
                        size: size.size,
                        quantity: size.quantity -1
                    }
                } else {
                    return size
                } //今回選んだサイズでなければそのまま返す
            })

            products.push({
                id: product.productId,
                images: product.images,
                name: product.name,
                price: product.price,
                size: product.size
            });//注文履歴用の商品データ

            batch.update(
                productsRef.doc(product.productId),
                {sizes: updateSizes}
            );

            batch.delete(
                userRef.collection('cart').doc(product.cartId)
            )
        } //productsInCart for文
        if(soldOutProducts.length > 0) {
            const errorMessage = (soldOutProducts.length > 1 )?
                                 soldOutProducts.join('と'):
                                 soldOutProducts[0]
            alert('大変申し訳ございません。' + errorMessage + 'が在庫切れとなったため、注文処理を中断しました。')
            return false  
        } else {
            batch.commit()
                .then(() => {
                    const orderRef = userRef.collection('orders').doc();
                    const date = timestamp.toDate();
                    // 配送日を3日後に設定
                    const shippingDate = FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)));
                    const history = {
                        amount: amount,
                        created_at: timestamp,
                        id: orderRef.id,
                        products: products,
                        shipping_date: shippingDate,
                        updated_at: timestamp
                    }
                    orderRef.set(history)
                    console.log("OK");
                    
                    dispatch(push('/'))
                }).catch(() =>{
                    alert('大変申し訳ございません。注文処理に失敗いたしました。通信環境をご確認ください。')
                    return false
                })
        }
    }
}

export const reflectSearchResult = (tempResults) => {
    return async (dispatch) => {
        const productList = [];
        const searchResults = tempResults;
        console.log(searchResults)
        searchResults.forEach(result =>{
            productList.push(result)
        })
        dispatch(fetchProductsAction(productList))
    }
}

export const fetchProducts = (gender, category) => {
    return async (dispatch) => {
        let query = productsRef.orderBy('updated_at','desc');
        query = (gender !== "") ? query.where('gender','==',gender) : query;
        query = (category !== "") ? query.where('category', '==', category) : query;

        query.get()//クエリの種類、自動でソートしてくれる。更新日付が新しい順で並び替えて取得。
            .then(snapshots => {
                const productList = []
                snapshots.forEach(snapshot => {
                    const product = snapshot.data();
                    productList.push(product)
                })
                dispatch(fetchProductsAction(productList))
            })
    }
}

export const saveProduct = (id,name,description,category,gender,price,images, sizes) => {
    return async (dispatch) => {
        const timestamp = FirebaseTimestamp.now()

        const data = {
            category: category,
            description: description,
            gender: gender,
            images: images,
            name: name,
            price: parseInt(price, 10), //文字列の値を数値に10進数の変換
            sizes: sizes,
            updated_at: timestamp
        }
        if(id === ""){
        const ref = productsRef.doc();
        id = ref.id
        data.id = id //dataに自動采配されたid項目を追加
        data.created_at = timestamp //dataに新規作成したサーバー時刻を追加
        } //既存商品の編集の場合、ここを実行すると再度ドキュメントidが新しく作られてしまうため条件分岐させる。

        return productsRef.doc(id).set(data, {merge: true}) //{merge: true}更新された部分だけを更新
            .then(() =>{
                dispatch(push('/'))
            }).catch((error)=>{
                throw new Error(error)
            })
    }
}