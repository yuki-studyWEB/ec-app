import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { db, FirebaseTimestamp } from '../../firebase/index'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { getUserId, getFavoriteProducts } from '../../reducks/users/selectors'
import { addFavoriteProduct } from '../../reducks/users/operations'

const FavoriteButton = (props) => {
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const uid = getUserId(selector)
    const favorites = getFavoriteProducts(selector)
    const checkFavo = favorites.filter((favorite) => favorite.productId === props.id)
    const [checked, setChecked] = useState(false)
    useEffect(() => {
        if (checkFavo.length !== 0) {
            setChecked(true)
        } else {
            setChecked(false)
        }
    }, [checkFavo])

    const handleChange = (event) => {
        if (checked !== true) {
            const timeStamp = FirebaseTimestamp.now()
            dispatch(
                addFavoriteProduct({
                    added_at: timeStamp,
                    images: props.images,
                    name: props.name,
                    price: props.price,
                    productId: props.id,
                    sellerName: props.sellerName
                })
            )
        } else {
            if (checkFavo.length > 0) {
                db.collection('users').doc(uid).collection('favorites').doc(checkFavo[0].favoriteId).delete()
            }
        }
    }

    return (
        <FormControlLabel
            control={
                <Checkbox
                    disabled={props.disabled}
                    icon={<FavoriteBorderIcon />}
                    checkedIcon={<FavoriteIcon />}
                    onChange={(e) => handleChange(e)}
                    checked={checked}
                    color="secondary"
                />
            }
            label={checked ? 'お気に入りから外す' : 'お気に入りに追加する'}
        />
    )
}

export default FavoriteButton
