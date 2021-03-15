import React,{useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import List from "@material-ui/core/List";
import {makeStyles} from "@material-ui/styles";
import { getFavoriteProducts } from '../reducks/users/selectors';
import { fetchFavoriteProducts } from '../reducks/users/operations';
import { FavoriteItem } from '../components/Products';

const useStyles = makeStyles((theme) =>({
    orderList: {
        background: theme.palette.red["100"],
        margin: '0 auto',
        padding: 32,
        [theme.breakpoints.down('md')]: {
            width: '100%'
        },
        [theme.breakpoints.up('md')]: {
            width: 768
        }
    },
    ttlOrderhistory: {
        fontSize: 22,
        fontWeight: 600
    }
}));

const FavoriteList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selecotor = useSelector((state) => state);
    const favorites = getFavoriteProducts(selecotor);

    useEffect(() =>{
        dispatch(fetchFavoriteProducts())
    },[])

    return (
        <section className="c-section-wrapin">
            <List className={classes.orderList}>
            <h2 className={classes.ttlOrderhistory}>お気に入り</h2>
                {favorites.length > 0 ? (
                    favorites.map(favorite => <FavoriteItem favorite={favorite} key={favorite.favoriteId} />)
                ):(
                <div>
                    <div className="module-spacer--medium" />
                    <p>現在お気に入りの登録がございません。</p>
                </div>
                )}
            </List>
        </section>
    )
}

export default FavoriteList