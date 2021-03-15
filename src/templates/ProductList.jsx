import React,{useEffect,useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ProductCard} from '../components/Products/';
import {fetchProducts} from '../reducks/products/operations';
import {getProducts, getSearchResult} from '../reducks/products/selectors';
import Pagination from "material-ui-flat-pagination";
import {makeStyles} from '@material-ui/styles';

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
    const handleClickPagination = (offsetNum)=>{
        setOffset(offsetNum);
    }

    const query = selector.router.location.search;
    //selectorがconnected-react-routerのURLに関する値を持っている。location.search =>クエリパラメータ
    const gender = /^\?gender=/.test(query) ? query.split('?gender=')[1] : "";
    const category = /^\?category=/.test(query) ? query.split('?category=')[1] : "";
    useEffect(()=>{
        dispatch(fetchProducts(gender, category))
    },[query,search]); //queryが変わる度に実行する。

    return(
        <section className="c-section-wrapin">
            <div className="p-grid__row">
                {products.length > 0 && (
                    products.slice(offset, offset + parPage)
                    .map(product => (
                        <ProductCard 
                            key={product.id} id={product.id} name={product.name}
                            images={product.images} price={product.price} creatorId={product.creatorId}
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