import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/styles'
import { getOrdersHistory } from '../reducks/users/selectors'
import { fetchOrdersHistory } from '../reducks/users/operations'
import { OrderHistoryItem } from '../components/Products/'

const useStyles = makeStyles((theme) => ({
    orderList: {
        background: theme.palette.grey['100'],
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
}))

const OrderHistory = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const selecotor = useSelector((state) => state)
    const orders = getOrdersHistory(selecotor)

    useEffect(() => {
        dispatch(fetchOrdersHistory())
    }, [])

    return (
        <section className="c-section-wrapin">
            <List className={classes.orderList}>
                <h2 className={classes.ttlOrderhistory}>注文履歴</h2>
                {orders.length > 0 ? (
                    orders.map((order) => <OrderHistoryItem order={order} key={order.id} />)
                ) : (
                    <div>
                        <div className="module-spacer--medium" />
                        <p>注文履歴がございません。</p>
                    </div>
                )}
            </List>
        </section>
    )
}

export default OrderHistory
