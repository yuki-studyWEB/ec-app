import React,{useEffect} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'; 
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MenuIcon from '@material-ui/icons/Menu';
import {getProductsInCart, getUserId} from "../../reducks/users/selectors";
import {useSelector, useDispatch} from 'react-redux';
import {db} from '../../firebase/index';
import {fetchProductsInCart} from "../../reducks/users/operations";
import {push} from 'connected-react-router';

const HeaderMenus = (props) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const uid = getUserId(selector);
    let productsInCart = getProductsInCart(selector);

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

    return(
        <>
            <IconButton onClick={() => dispatch(push('/cart'))}>
                <Badge badgeContent={productsInCart.length} color="secondary">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
            <IconButton>
                <FavoriteBorderIcon />
            </IconButton>
            <IconButton onClick={(event) => props.handleDrawerToggle(event)}>
                <MenuIcon />
            </IconButton>
        </>
    )
}

export default HeaderMenus