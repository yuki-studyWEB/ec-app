import React,{useState,useEffect, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db,FirebaseTimestamp } from '../firebase';
import HTMLReactParser from 'html-react-parser';
import { makeStyles } from '@material-ui/styles';
import {ImageSwiper, SizeTable} from "../components/Products/"
import {addProductToCart,addFavoriteProduct} from "../reducks/users/operations"
import Checkbox from '@material-ui/core/Checkbox';
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getUserId,getFavoriteProducts } from '../reducks/users/selectors';

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
    const favorites = getFavoriteProducts(selector)
    const path = selector.router.location.pathname; //reduxのstoreで管理しているルーティングのパスの中。
    const id = path.split('/product/')[1];
    const checkFavo = favorites.filter(favorite => favorite.productId === id)
    const[checked, setChecked] = useState(false);
    const[product, setProduct] = useState(null);

    useEffect(() =>{
        db.collection('products').doc(id).get()
            .then(doc =>{
                const data = doc.data();
                setProduct(data);
            })
    },[]);

    useEffect(() =>{
        if(checkFavo.length !== 0){
            setChecked(true)
        }else{setChecked(false)}
    })


    const handleChange = (event) => {
        setChecked(event.target.checked);
        console.log(checked)
        if(checked !== true){
            const timeStamp = FirebaseTimestamp.now();
            dispatch(addFavoriteProduct({
                added_at: timeStamp,
                images: product.images,
                name: product.name,
                price: product.price,
                productId: product.id,
            }))
        } else {
            if(checkFavo.length !== 0){
                db.collection("users").doc(uid)
                .collection("favorites").doc(checkFavo[0].favoriteId)
                .delete();
            }
        }
    };

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
            size: selectedSize
        }))
    },[product])//子コンポーネントに渡すときはuseCallbackでメモ化
    
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
                        <SizeTable addProduct={addProduct} sizes={product.sizes}/>
                        <div className="module-spacer--extra-extra-small" />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    icon={<FavoriteBorderIcon />}
                                    checkedIcon={<FavoriteIcon />}
                                    onChange={e => handleChange(e)}
                                    checked={checked}
                                />
                            }
                            label={checked ? "お気に入りから外す":"お気に入りに追加する"}
                        />
                        <div className="module-spacer--small" />
                        <p>{returnCodeToBr(product.description)}</p>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ProductDetail