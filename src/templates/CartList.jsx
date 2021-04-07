import React, { useCallback, useLayoutEffect, useState } from 'react'
import List from '@material-ui/core/List'
import { useSelector, useDispatch } from 'react-redux'
import { getProductsInCart } from '../reducks/users/selectors'
import { CartListItem } from '../components/Products'
import { PrimaryButton, GreyButton } from '../components/UIkit'
import { push } from 'connected-react-router'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    root: {
        margin: '0 auto',
        maxWidth: 512,
        width: '100%'
    }
})

const CartList = () => {
    const classes = useStyles()
    const selector = useSelector((state) => state)
    const ProductsInCart = getProductsInCart(selector)
    const dispatch = useDispatch()
    const [disableOrder, setDisableOrder] = useState(false)

    const goToOrder = useCallback(() => {
        dispatch(push('/order/confirm'))
    }, [])
    const backToHome = useCallback(() => {
        dispatch(push('/'))
    }, [])

    useLayoutEffect(() => {
        if (!ProductsInCart.length > 0) {
            setDisableOrder(true)
        }
    }, [ProductsInCart])

    return (
        <section className="c-section-wrapin">
            <h2 className="u-text__headline">ショッピングカート</h2>
            <List className={classes.root}>
                {ProductsInCart.length > 0 ? (
                    ProductsInCart.map((product) => <CartListItem key={product.cartId} product={product} />)
                ) : (
                    <div>
                        <div className="module-spacer--medium" />
                        <p>カートに商品がございません。</p>
                    </div>
                )}
            </List>
            <div className="module-spacer--medium" />
            <div className="p-grid__column">
                <PrimaryButton label="レジへ進む" onClick={goToOrder} disabled={disableOrder} />
                <div className="module-spacer--small" />
                <GreyButton label={'ショッピングを続ける'} onClick={backToHome}></GreyButton>
            </div>
        </section>
    )
}

export default CartList
