import React, { useCallback } from 'react'
import {List, ListItem, ListItemAvatar, ListItemText, Divider} from "@material-ui/core"
import {makeStyles} from "@material-ui/styles"
import {PrimaryButton} from "../UIkit"
import {useDispatch} from "react-redux"
import {push} from "connected-react-router"

const useStyles = makeStyles({
    list: {
        background: '#fff',
        height: 'auto'
    },
    image: {
        objectFit: 'cover',
        margin: '8px 16px 8px 0',
        height: 96,
        width: 96
    },
    text: {
        width: '100%'
    }
})

const OrderedProducts = (props) =>{
    const classes = useStyles();
    const dispatch = useDispatch();
    const products = props.products;

    const goToProductDetail = useCallback((id) => {
        dispatch(push('/product/'+id))
    },[])

    return(
        <List>
            {Object.keys(products).map(key => {
                const product = products[key]
                return(
                    <ListItem className={classes.list} key={product.id}>
                        <ListItemAvatar>
                            <img 
                                className={classes.image}
                                src={product.images[0].path}
                                alt="Orderd Product"
                            />
                        </ListItemAvatar>
                        <div className={classes.text}>
                            <ListItemText 
                                primary={product.name}
                                secondary={"サイズ： " + product.size}
                            />
                            <ListItemText 
                                primary={product.price.toLocaleString()}
                            />
                            <ListItemText 
                                primary={'出品者：'+product.sellerName}
                            />
                        </div>
                        <PrimaryButton
                            label={"商品を見る"}
                            onClick={() => goToProductDetail(product.id)}
                        />
                    </ListItem>
                )}
            )}
        </List>
    )
}

export default OrderedProducts