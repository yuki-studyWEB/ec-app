import { db, FirebaseTimestamp } from "../../firebase"
import {push} from 'connected-react-router'
import {fetchProductsAction, deleteProductAction, searchResultAction, resetSearchResultAction} from './actions'
import ProductList from "../../templates/ProductList";
const algoliasearch = require("algoliasearch");
const client = algoliasearch(
  process.env.REACT_APP_ALGOLIA_ID,
  process.env.REACT_APP_ADMIN_API_KEY
);
const index = client.initIndex("ecProducts");

const productsRef = db.collection('products');

export const deleteProduct = (id) => {
    return async (dispatch, getState) => {
        index.deleteObject(id).then(() => {
            productsRef.doc(id).delete()
                .then(() => {
                    const prevProducts = getState().products.list;
                    const nextProducts = prevProducts.filter(product => product.id !== id)
                    dispatch(deleteProductAction(nextProducts))
                })
            
        });
    }
}
export const resetSearchResult = () => {
    return async (dispatch) => {
            const resetresult = []
            dispatch(resetSearchResultAction(resetresult))            
        };
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
                size: product.size,
                sellerName: product.sellerName
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
        searchResults.forEach(result =>{
            productList.push(result)
        })
        dispatch(searchResultAction(productList))
    }
}

export const fetchProducts = (gender, category, price, hash) => {
    return async (dispatch, getState) => {
        if(hash === 'myproducts'){
            //ユーザーが出品した商品だけに絞る処理
            const uid = getState().users.uid;
            const query = await productsRef.orderBy('updated_at','desc');
            query.where('creatorId','==',uid).get()
                .then(snapshots =>{
                    const productList = [];
                    snapshots.forEach(snapshot =>{
                        const product = snapshot.data();
                        productList.push(product)
                    })
                    dispatch(fetchProductsAction(productList))
                })
            
        } else {
            const searchResults = getState().products.searchResult;
            
            let query = {};
            if(searchResults.length > 0){
             // キーワード検索も実行していた場合の処理
                query = searchResults.sort((a,b)=>{
                    return a.updated_at - b.updated_at;
                });
                let genderitems = 
                    query.filter((item,index) =>{
                        if(item.gender === gender) return true;
                    })
                let categoryitems = 
                    query.filter((item,index) =>{
                        if(item.category === category) return true;
                    })
                let priceitems = 
                    query.filter((item,index) =>{
                        if(item.price >= parseInt(price[0]) && item.price <= parseInt(price[1])) return true;
                    })
                if(gender || category || price){
                    const productList = genderitems.concat(categoryitems,priceitems);
                    dispatch(fetchProductsAction(productList));
                } else {
                    dispatch(fetchProductsAction(query));
                }
            }else{
             // キーワード検索なし
                query = productsRef.orderBy('updated_at', 'desc');
                query = (gender !== "") ? query.where('gender','==',gender) : query;
                query = (category !== "") ? query.where('category', '==', category) : query;
                await query.get()//クエリの種類、自動でソートしてくれる。更新日付が新しい順で並び替えて取得。
                    .then(snapshots => {
                        const productList = []
                        snapshots.forEach(snapshot => {
                            const product = snapshot.data();
                            productList.push(product)
                        })
                        
                        if(price.length > 1){
                            //金額の指定も入っていた場合
                            let newProductList = productList.filter((item,index) =>{
                                if(item.price >= parseInt(price[0]) && item.price <= parseInt(price[1])) return true;
                            })
                            dispatch(fetchProductsAction(newProductList));
                        }else{
                            dispatch(fetchProductsAction(productList));
                        }
                })
            }
        }
    }
}

export const saveProduct = (id,name,description,category,gender,price,images, keyword, sizes) => {
    return async (dispatch, getState) => {
        //バリデーション
        if (name === "" || description==="" || category==="" || gender==="" || price===""){
            alert("必須項目が未入力です")
            return false
        }
        if (sizes.length === 0){
            alert("サイズを一つ以上作成してください")
            return false
        }
        const timestamp = FirebaseTimestamp.now();
        const uid = getState().users.uid;
        const userName = getState().users.username;

        const data = {
            category: category,
            description: description,
            gender: gender,
            images: images,
            name: name,
            price: parseInt(price, 10), //文字列の値を数値に10進数の変換
            sizes: sizes,
            updated_at: timestamp,
            creatorId: uid,
            creatorName: userName,
            keyword: keyword
        }
        if(id === ""){
            //既存商品の編集の場合、ここを実行すると再度ドキュメントidが新しく作られてしまうため条件分岐させる。
            const ref = productsRef.doc();
            id = ref.id
            data.id = id //dataに自動采配されたid項目を追加
            data.created_at = timestamp //dataに新規作成したサーバー時刻を追加
        } else {
            //algolia、オブジェクトの更新
            data.objectID = id;
            await index.saveObject(data)    
                .then(() => {
                    delete data.objectID; //firebaseDBでは不要なフィールドのため消す
                })
                .catch(error => {
                    process.exit(1);
                });
        }
        return productsRef.doc(id).set(data, {merge: true}) //{merge: true}更新された部分だけを更新
            .then(() =>{
                alert("商品の出品が完了しました。")
                dispatch(push('/'))
            }).catch((error)=>{
                throw new Error(error)
            })
    }
}