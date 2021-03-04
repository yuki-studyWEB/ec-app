import React,{useState, useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import NoImage from '../../assets/img/src/no_image.png'
import {push} from 'connected-react-router';
import {useDispatch, useSelector} from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MOreVertIcon from '@material-ui/icons/MoreVert';
import {deleteProduct} from "../../reducks/products/operations";
import {getUserId} from "../../reducks/users/selectors";


//themeを使うことでブレイクポイントや配色の設定が可能
const useStyles = makeStyles ((theme) => ({
    root: {
        [theme.breakpoints.down('sm')]: { //幅がsm(スマートフォン表示:576px)の幅以下の時
            margin: 8,
            width: 'calc(50% -16px)'
        },
        [theme.breakpoints.up('sm')]: {
            margin: 16,
            width: 'calc(33.3333% - 32px)'
        }
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 8px 16px 20px',
        textAlign: 'left',
        '&:last-child': {
            paddingBottom: 16
        } 
    },
    media: {
        height: 0,
        paddingTop: '100%',
    },
    price: {
        color: theme.palette.secondary.main,
        fontSize: 16
    }
}));

const ProductCard = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) =>state)
    const uid = getUserId(selector) 

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget)
    },[setAnchorEl]);
    const handleClose = () => {
        setAnchorEl(null)
    };

    const images = (props.images.length > 0) ? props.images : [{path: NoImage}];
    const price = props.price.toLocaleString(); //三桁区切りの文字列を返す。

    return(
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={images[0].path} //imagesの一番頭の画像を展示
                title=""
                onClick={() => dispatch(push('/product/' + props.id))}
            />
            <CardContent className={classes.content}>
                <div onClick={() => dispatch(push('/product/' + props.id))}>
                    <Typography color="textSecondary" component="p">
                        {props.name}
                    </Typography>
                    <Typography className={classes.price} component="p">
                        ¥{price}
                    </Typography>
                </div>
                {props.creatorId === uid ? ( //商品の作者が一致していれば編集削除可能
                <div>
                    <IconButton onClick={handleClick}>
                        <MOreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem
                            onClick={() => {
                                dispatch(push('/product/edit/' + props.id))
                                handleClose()
                            }}
                        >
                            編集する
                        </MenuItem>
                        <MenuItem
                            onClick={() =>{
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

                </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ProductCard;