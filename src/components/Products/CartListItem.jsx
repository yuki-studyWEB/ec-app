import React from 'react';
import {makeStyles} from '@material-ui/styles';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {useSelector} from "react-redux";
import {getUserId} from '../../reducks/users/selectors';
import {db} from '../../firebase/index'

const useStyles = makeStyles({
    list: {
        height: 128
    },
    image: {
        objectFit: 'cover',
        margin: 16,
        width: 96,
        height: 96
    },
    text: {
        width: '100%'
    }
})

const CartListItem = (props) => {
    const classes = useStyles();
    const selector = useSelector((state)=>state);
    const uid = getUserId(selector);

    const image = props.product.images[0].path;
    const name  = props.product.name;
    const price = props.product.price.toLocaleString();
    const size  = props.product.size;

    const removeProductFormCart = (id) => {
        return db.collection('users').doc(uid)
                 .collection('cart').doc(id)
                 .delete()
    }

    return (
        <>
            <ListItem className={classes.list}>
                <ListItemAvatar>
                    <img className={classes.image} src={image} alt="商品画像" />
                </ListItemAvatar>
                <div className={classes.text}>
                    <ListItemText
                        primary={name}
                        secondary={"サイズ："+ size}
                    />
                    <ListItemText 
                        primary={"¥" + price}
                    />
                </div>
                <IconButton onClick={() => removeProductFormCart(props.product.cartId)}>
                    <DeleteIcon />
                </IconButton>
                <Divider />
            </ListItem>
        </>
    )
}

export default CartListItem