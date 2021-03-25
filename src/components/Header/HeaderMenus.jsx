import React,{useEffect,useState} from 'react';
import {IconButton, Badge} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'; 
import MenuIcon from '@material-ui/icons/Menu';
import {getProductsInCart, getUserId, getFavoriteProducts, getUsername} from "../../reducks/users/selectors";
import {useSelector, useDispatch} from 'react-redux';
import {db} from '../../firebase/index';
import {fetchProductsInCart, fetchFavoriteProducts} from "../../reducks/users/operations";
import {resetSearchResult} from '../../reducks/products/operations';
import {push} from 'connected-react-router';
import {makeStyles} from '@material-ui/styles'

const userStyles = makeStyles((theme)=>({
    userName: {
        display: 'inline-block',
        marginRight: 10,
        lineHeight: 1.5,
        fontSize: 14,
        verticalAlign: 'middle',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
}));
const HeaderMenus = (props) => {
    const classes = userStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const uid = getUserId(selector);
    const userName = getUsername(selector);
    let productsInCart = getProductsInCart(selector);
    let userFavorites = getFavoriteProducts(selector);

    useEffect(()=>{
        const unsubscribe = db.collection('users').doc(uid).collection('cart')
            .onSnapshot(snapshots =>{ //DBのリストが変更されたかここで検知し、リストが書き込みされた後すぐ実行し、元々入手していた古いリストとの差分を見て変化があったカートのIDを探し出す。
                snapshots.docChanges().forEach(change => {
                    const product = change.doc.data();
                    const changeType = change.type;
                    
                    switch (changeType) {
                        case 'added':
                            productsInCart.push(product);
                            break; //初期化時は全部ここ。
                        case 'modified':
                            const index = productsInCart.findIndex(product => product.cartId === change.doc.id)
                            productsInCart[index] = product
                            break; //product.cart=>selectorで手に入れた古いcart全体 change.doc=>書き込み後のcart
                        case 'removed':
                            productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id)
                            break;
                        default:
                        break;
                    }
                })
                dispatch(fetchProductsInCart(productsInCart));//現愛のカートの最新情報
            });
            return () =>unsubscribe()
    },[])

    //favorites
    useEffect(()=>{
        const unsubscribe = db.collection('users').doc(uid).collection('favorites')
            .onSnapshot(snapshots =>{
                snapshots.docChanges().forEach(change => {
                    const favorite = change.doc.data();
                    const changeType = change.type;
                    
                    switch (changeType) {
                        case 'added':
                            userFavorites.push(favorite);
                            break;
                        case 'modified':
                            const index = userFavorites.findIndex(favorite => favorite.favoriteId === change.doc.id)
                            userFavorites[index] = favorite
                            break;
                        case 'removed':
                            userFavorites = userFavorites.filter(favorite => favorite.favoriteId !== change.doc.id)
                            break;
                        default:
                        break;
                    }
                })
                dispatch(fetchFavoriteProducts(userFavorites));//現愛のカートの最新情報
            });
            return () =>unsubscribe()
    },[])

    const goToCart = () => {
        props.setReset(props.reset + 1)
        dispatch(resetSearchResult())
        dispatch(push('/cart'))
    }

    return(
        <>
            <p className={classes.userName} >{userName} 様</p>
            <IconButton onClick={goToCart}>
                <Badge badgeContent={productsInCart.length} color="primary">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
            <IconButton onClick={(event) => props.handleDrawerToggle(event)}>
                <MenuIcon />
            </IconButton>
        </>
    )
}

export default HeaderMenus