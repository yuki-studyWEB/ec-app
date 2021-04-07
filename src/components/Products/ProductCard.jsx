import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, CardMedia, Typography, IconButton, Menu, MenuItem } from '@material-ui/core'
import NoImage from '../../assets/img/src/no_image.png'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import MOreVertIcon from '@material-ui/icons/MoreVert'
import { deleteProduct } from '../../reducks/products/operations'
import { getUserId } from '../../reducks/users/selectors'
import { FavoriteButtonInCard } from './index'

//themeを使うことでブレイクポイントや配色の設定が可能
const useStyles = makeStyles((theme) => ({
    root: {
        boxSizing: 'border-box',
        [theme.breakpoints.down('sm')]: {
            margin: '8px auto',
            width: 'calc(50% - 10px)',
            border: '#ddd 1px solid'
        },
        [theme.breakpoints.up('sm')]: {
            margin: 16,
            width: 'calc(23% - 15px)'
        },
        borderRadius: 2
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'left',
        '&:last-child': {
            paddingBottom: 13
        },
        [theme.breakpoints.down('sm')]: {
            padding: '10px 0 10px 12px'
        },
        [theme.breakpoints.up('sm')]: {
            padding: '12px 8px 12px 20px'
        }
    },
    media: {
        height: 0,
        paddingTop: '100%',
        cursor: 'pointer',
        position: 'relative',
        '&::before': {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            content: '""',
            display: 'block',
            transition: '150ms ease'
        },
        '&:hover::before': {
            backgroundColor: 'rgba(250,250,250,0.3)'
        }
    },
    itemName: {
        color: theme.palette.ttl.dark,
        fontWeight: 600,
        letterSpacing: 1.25,
        overflow: 'hidden',
        [theme.breakpoints.down('sm')]: {
            height: '72%',
            fontSize: 12.5
        },
        [theme.breakpoints.up('sm')]: {
            height: 52.5,
            fontSize: 16.5
        }
    },
    price: {
        [theme.breakpoints.down('sm')]: {
            fontSize: 12.5
        },
        [theme.breakpoints.up('sm')]: {
            fontSize: 16
        }
    },
    morevert: {
        color: theme.palette.secondary.contrastText
    },
    favorite: {
        marginRight: 0
    }
}))

const ProductCard = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const uid = getUserId(selector)

    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = useCallback(
        (event) => {
            setAnchorEl(event.currentTarget)
        },
        [setAnchorEl]
    )
    const handleClose = () => {
        setAnchorEl(null)
    }

    const images = props.images.length > 0 ? props.images : [{ path: NoImage }]
    const price = props.price.toLocaleString() //三桁区切りの文字列を返す。

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={images[0].path} //imagesの一番頭の画像を展示
                title=""
                onClick={() => dispatch(push('/product/' + props.id + '/?' + props.URLparam))}
            />
            <CardContent className={classes.content}>
                <div className={classes.contentText}>
                    <Typography className={classes.itemName} component="p">
                        {props.name}
                    </Typography>
                    <Typography className={classes.price} component="p">
                        ¥{price}
                    </Typography>
                </div>
                {props.creatorId === uid ? ( //商品の作者が一致していれば編集削除可能
                    <div>
                        <IconButton className={classes.morevert} onClick={handleClick}>
                            <MOreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem
                                onClick={() => {
                                    dispatch(push('/edit/' + props.id + '/?' + props.URLparam))
                                    handleClose()
                                }}
                            >
                                編集する
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    dispatch(deleteProduct(props.id))
                                    handleClose()
                                }}
                            >
                                削除する
                            </MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <div>
                        <FavoriteButtonInCard
                            id={props.id}
                            images={props.images}
                            name={props.name}
                            price={props.price}
                            sellerName={props.sellerName}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ProductCard
