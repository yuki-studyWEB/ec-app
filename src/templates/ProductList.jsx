import React,{useEffect,useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ProductCard} from '../components/Products/';
import {fetchProducts} from '../reducks/products/operations';
import {getProducts, getSearchResult} from '../reducks/products/selectors';
import Pagination from "material-ui-flat-pagination";
import {makeStyles} from '@material-ui/styles';
import {Divider} from '@material-ui/core';
import { db,FirebaseTimestamp } from '../firebase';

const useStyles = makeStyles((theme)=>({
    pageNavi: {
    textAlign: 'center',
    '& > button': {
        width: 50,
        height: 50,
        margin: '0 5px',
        borderRadius: 5,
    }
    },
    pageNaviCurrent: {
    color: '#333',
    '&:hover': {
        color: '#333'
    }
    },
    pageNaviText: {
    color: 'black'
    },
    pageNaviStandard: {
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
    },
    pageNaviArrow: {
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
    }
}))

const ProductList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state); //現在のreduxのストアのstateの全体が入っている
    const products = getProducts(selector);
    const search = getSearchResult(selector)
    const [offset, setOffset] = useState(0);
    const [parPage, setParPage] = useState(6);
    const [sellerName,setSellerName] = useState("");
    const handleClickPagination = (offsetNum)=>{
        setOffset(offsetNum);
    }
    const URLparam = selector.router.location.search.substring(1);
    //ユーザーが出品した商品を検索
    const URLhash = window.location.hash.substring(1);

    useEffect(()=>{
        const queries = URLparam.split('&');
        const gender = queries.filter(query => query.match(/gender=(.*?)(&|$)/)).join().replace('gender=','');
        const category = queries.filter(query => query.match(/category=(.*?)(&|$)/)).join().replace('category=','');
        const price = queries.filter(query => query.match(/price=(.*?)(&|$)/)).join().replace('price=','').split(',');
        dispatch(fetchProducts(gender, category, price, URLhash))
    },[URLparam,search]); //パラメータ&キーワード検索が実行される度に実行する。

    useEffect(()=>{
        products.map(product =>{
            const creatorId = product.creatorId;
            db.collection('users').doc(creatorId).get()
            .then((user)=>{
                setSellerName(user.data().username);
            })
        });
    },[products]);

    return(
        <section className="c-section-wrapin">
        {URLhash === "myproducts" && (
            <div>
                <div className="module-spacer--extra-small" />
                <p>現在出品中のアイテム({products.length})</p>
                <Divider />
                <div className="module-spacer--small" />
            </div>
        )}
            <div className="p-grid__row">
                {products.length > 0 && (
                    products.slice(offset, offset + parPage)
                    .map(product => (
                        <ProductCard 
                            key={product.id} id={product.id} name={product.name} sellerName={sellerName}
                            images={product.images} price={product.price} creatorId={product.creatorId}
                            URLparam={URLparam}
                        />
                    ))
                )}
            </div>
                <Pagination
                    limit={parPage} offset={offset} total={products.length} 
                    className={classes.pageNavi}
                    onClick={(e, offsetNum) => handleClickPagination(offsetNum)}
                    classes={{
                        rootStandard: classes.pageNaviStandard,
                        rootCurrent: classes.pageNaviCurrent,
                        rootEnd: classes.pageNaviArrow,
                        text: classes.pageNaviText
                    }}
                />
        </section>
    )
};

export default ProductList