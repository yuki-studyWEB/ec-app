import React, { useCallback } from 'react'
import {TextDetail} from "../UIkit"
import {makeStyles} from "@material-ui/styles"
import {PrimaryButton} from "../UIkit"
import {useDispatch, useSelector} from "react-redux"
import {push} from "connected-react-router"
import {Divider, IconButton} from "@material-ui/core"
import DeleteIcon from '@material-ui/icons/Delete';
import {db} from '../../firebase/index';
import {getUserId} from "../../reducks/users/selectors";

const useStyles = makeStyles((theme)=>({
    flexwrap: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block',
        }
    },
    image: {
        [theme.breakpoints.up('sm')]: {
            objectFit: 'cover',
            margin: '8px 16px 8px 0',
            width: 250,
            height: 250
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block',
            width: '100%',
            height: '250px',
            marginBottom: '1em',
            objectFit: 'cover'
        }
    },
    text: {
        [theme.breakpoints.up('sm')]: {
            width: 295
        }
    },
    buttonWrap: {
        [theme.breakpoints.up('sm')]: {
            marginTop: 20
        },
        [theme.breakpoints.down('sm')]: {
            display: 'flex'
        }
    },
    deleteButton: {
        [theme.breakpoints.up('sm')]: {
            margin: '15px 15px 0 0'
        },
        [theme.breakpoints.down('sm')]: {
            margin: '0 15px 0 0'
        }
    }
}))

const datatimeToString = (date) =>{
    return date.getFullYear() + '-'
    + ('00' + (date.getMonth()+1)).slice(-2) + '-'
    + ('00' + date.getDate()).slice(-2) + " "
}

const FavoriteItem = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state)=>state);
    const uid = getUserId(selector);

    const favorite = props.favorite;
    const addDatetime = datatimeToString(favorite.added_at.toDate());
    const price = "¥" + favorite.price.toLocaleString();

    const goToProductDetail = useCallback(()=>{
        dispatch(push('/product/'+favorite.productId))
    },[favorite])

    const removeFavoriteItem = (id) => {
        return db.collection('users').doc(uid)
                 .collection('favorites').doc(id)
                 .delete()
    }

    return (
        <>
            <div className="module-spacer--small" />
            <div className={classes.flexwrap}>
                <div className={classes.image}>
                    <img 
                        className={classes.image}
                        src={favorite.images[0].path}
                        alt="Orderd Product"
                    />
                </div>
                <div className={classes.text}>
                    <TextDetail label={"商品名"} value={favorite.name} />
                    <TextDetail label={"お気に入り登録日"} value={addDatetime} />
                    <TextDetail label={"金額"} value={price} />
                    <TextDetail label={"出品者"} value={favorite.sellerName} />
                </div>
            </div>
            <div className={classes.buttonWrap}>
                <IconButton className={classes.deleteButton} onClick={() => removeFavoriteItem(favorite.favoriteId)}>
                    <DeleteIcon />
                </IconButton>
                <PrimaryButton label={"商品を見る"} onClick={goToProductDetail}/>
            </div>
            <div className="module-spacer--extra-small" />
            <Divider />
        </>
    )
}

export default FavoriteItem