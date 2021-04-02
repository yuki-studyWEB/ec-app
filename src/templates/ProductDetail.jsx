import React,{useState,useEffect,useLayoutEffect, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db,FirebaseTimestamp } from '../firebase';
import HTMLReactParser from 'html-react-parser';
import { makeStyles } from '@material-ui/styles';
import {ImageSwiper, SizeTable} from "../components/Products/"
import {addProductToCart} from "../reducks/users/operations"
import {FavoriteButton} from "../components/Products/index"
import { getUserId } from '../reducks/users/selectors';
import {push} from 'connected-react-router';

const useStyles = makeStyles((theme) => ({
    sliderBox: {
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 24px auto',
            height: 320,
            width: 320
        },
        [theme.breakpoints.up('sm')]: {
            margin: '0 auto',
            height: 400,
            width: 400
        },
    },
    detail: {
        textAlign: 'left',
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 16px auto',
            height: 320,
            width: 320
        },
        [theme.breakpoints.up('sm')]: {
            margin: '0 auto',
            height: 'auto',
            width: 400
        },
    },
    price: {
        fontSize: 36
    }
}))

const returnCodeToBr = (text) => {
    if(text === "") {
        return text
    } else {
        return HTMLReactParser(text.replace(/\r?\n/g,'<br/>'))
    } //textを改行を<br>に変換し、HTMLReactParserでHTMLの文字列をreactのコンポーネントの中で使えるようにする。
}

const ProductDetail = () => {
    const classes = useStyles()
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const uid = getUserId(selector)
    const path = selector.router.location.pathname; //reduxのstoreで管理しているルーティングのパスの中。
    const URLparam = window.location.search;
    const id = path.slice(0,-1).split('/product/')[1];
    const [product, setProduct] = useState(null);
    const [sellerName,setSellerName] = useState("");
    const [myItem,setMyItem] = useState(false);
    const notInCart = (creatorId) =>{
        if(uid === creatorId){
            setMyItem(true)
        }
    }

    useLayoutEffect(() =>{
        db.collection('products').doc(id).get()
            .then(doc =>{
                const data = doc.data();
                setProduct(data);
                //出品者の定義
                const creatorId = data.creatorId;
                db.collection('users').doc(creatorId).get()
                .then((user)=>{
                    setSellerName(user.data().username);
                    notInCart(creatorId);
                })
            })
    },[]);

    const addProduct = useCallback((selectedSize) => {
        const timeStamp = FirebaseTimestamp.now();
        dispatch(addProductToCart({
            added_at: timeStamp,
            desctiption: product.description,
            gender: product.gender,
            images: product.images,
            name: product.name,
            price: product.price,
            productId: product.id,
            quantity: 1,
            size: selectedSize,
            sellerName: sellerName
        }))
    },[product,sellerName])//子コンポーネントに渡すときはuseCallbackでメモ化


    return(
        <section className="c-section-wrapin">
            {product && (
                <div className="p-grid__row">
                    <div className={classes.sliderBox}>
                        <ImageSwiper images={product.images}/>
                    </div>
                    <div className={classes.detail}>
                        <h2 className="u-text__headline">{product.name}</h2>
                        <p className={classes.price}>¥{product.price.toLocaleString()}</p>
                        <div className="module-spacer--small" />
                        <SizeTable addProduct={addProduct} sizes={product.sizes} myItem={myItem}/>
                        <div className="module-spacer--extra-extra-small" />
                        {myItem && ("※このアイテムの出品者のためご購入はできません。")}
                        <FavoriteButton 
                            id={id} images={product.images} disabled={myItem}
                            name={product.name} price={product.price} sellerName={sellerName}
                        />
                        <div className="module-spacer--small" />
                        <p>{returnCodeToBr(product.description)}</p>
                        <p>出品者：{sellerName}</p>
                    </div>
                </div>
            )}
            <div className="module-spacer--small" />
            <p onClick={() => dispatch(push('/' + URLparam)) } className="textButton">
                買い物に戻る
            </p>
        </section>
    )
}

export default ProductDetail