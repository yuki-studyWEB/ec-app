import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import { getUsername } from '../../reducks/users/selectors'
import {
    Button,
    Drawer,
    List,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Slider,
    Typography
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import HistoryIcon from '@material-ui/icons/History'
import PersonIcon from '@material-ui/icons/Person'
import HomeIcon from '@material-ui/icons/Home'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { TextInput } from '../UIkit/index'
import { signOut, resetProductsInCart } from '../../reducks/users/operations'
import { reflectSearchResult, resetSearchResult } from '../../reducks/products/operations'
import { db } from '../../firebase/index'
const algoliasearch = require('algoliasearch')
const client = algoliasearch(process.env.REACT_APP_ALGOLIA_ID, process.env.REACT_APP_ADMIN_API_KEY)
const index = client.initIndex('ecProducts')
const useStyles = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
            flexShrink: 0,
            width: 256
        }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        [theme.breakpoints.up('sm')]: {
            width: 300
        },
        [theme.breakpoints.down('sm')]: {
            width: '64%'
        }
    },
    searchField: {
        alignItems: 'center',
        display: 'flex',
        marginLeft: 20
    },
    userName: {
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block',
            padding: '6px 2px 6px 20px',
            backgroundColor: '#EFB',
            fontSize: 14
        }
    }
}))
const ClosableDrawer = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const userName = getUsername(selector)
    const { container } = props
    const [reset, setReset] = useState(0)
    const [searchResult, setSearchResult] = useState([])
    const [selectedGender, setSelectedGender] = useState(0),
        [selectedCategory, setSelectedCategory] = useState(0)
    const [price, setPrice] = useState([0, 50000]),
        [prevState, setPrevState] = useState([])
    const [filters, setFilters] = useState([])

    //キーワード検索
    const onSearch = async (e) => {
        let tempResults = []
        await index.search(e.target.value).then((responses) => {
            tempResults = responses.hits
        })
        setSearchResult(tempResults)
    }
    const confirmSearch = (event) => {
        let locationSearch = window.location.search
        if (event.key === 'Enter' || event.type === 'click') {
            if ((window.location.pathname !== '') | '/') {
                dispatch(push('/' + locationSearch))
            }
            dispatch(reflectSearchResult(searchResult))
            props.onClose(event)
        }
    }

    //パラメータの設定
    const setParams = (path, newParams) => {
        switch (newParams.length) {
            case 2:
                return '/?' + newParams[0] + '&' + newParams[1] + '&' + path.split('/?')[1]
            case 1:
                return '/?' + newParams + '&' + path.split('/?')[1]
            default:
                return '/?' + path.split('/?')[1]
        }
    }
    const resetParams = (newParams) => {
        //"すべて"がセレクトされたときの処理
        switch (newParams.length) {
            case 2:
                return '/?' + newParams[0] + '&' + newParams[1]
            case 1:
                return '/?' + newParams
            default:
                return '/'
        }
    }
    //性別セレクト
    const selectQueryGender = (event, path, index) => {
        let locationSearch = window.location.search
        const params = locationSearch.substring(1).split('&')
        const newParams = params.filter((param) => param.match(/category=(.*?)(&|$)|price=(.*?)(&|$)/))
        if (selectedGender === index) {
            setSelectedGender(0)
            const resetpath = resetParams(newParams)
            dispatch(push(resetpath))
        } else {
            setSelectedGender(index)
            if (locationSearch !== '') {
                const addpath = index !== 0 ? setParams(path, newParams) : resetParams(newParams)
                dispatch(push(addpath)) //menu.value
            } else {
                dispatch(push(path)) //menu.value
            }
        }
    }
    //カテゴリーセレクト
    const selectQueryCategory = (event, path, index, currentIndex) => {
        let locationSearch = window.location.search
        const params = locationSearch.substring(1).split('&')
        const newParams = params.filter((param) => param.match(/gender=(.*?)(&|$)|price=(.*?)(&|$)/))
        if (currentIndex === index) {
            setSelectedCategory(0)
            const resetpath = resetParams(newParams)
            dispatch(push(resetpath))
        } else {
            setSelectedCategory(index)
            if (locationSearch !== '') {
                const addpath = index !== 0 ? setParams(path, newParams) : resetParams(newParams)
                dispatch(push(addpath)) //menu.value
            } else {
                dispatch(push(path)) //menu.value
            }
        }
    }
    //金額範囲指定
    const selectRangePrice = (event, selecterPrice) => {
        let locationSearch = window.location.search
        const params = locationSearch.substring(1).split('&')
        const newParams = params.filter((param) => param.match(/gender=(.*?)(&|$)|category=(.*?)(&|$)/))
        if (selecterPrice === '') {
            setPrice([0, 50000])
            const resetpath = resetParams(newParams)
            dispatch(push(resetpath))
        } else {
            if (locationSearch !== '') {
                const addpath = setParams(selecterPrice, newParams)
                dispatch(push(addpath)) //menu.value
            } else {
                const addpath = selecterPrice
                dispatch(push(addpath)) //menu.value
            }
        }
    }

    //priceSliderの処理
    function valuetext(price) {
        return `¥${price}`
    }
    const handleSlider = (event, newValue) => {
        setPrice(newValue)
    }
    const marks = [
        {
            value: 0,
            label: '¥0'
        },
        {
            value: 50000,
            label: '¥50000'
        }
    ]

    const selectMenu = (event, path) => {
        if (selectedGender || selectedCategory || searchResult.length > 0) {
            setSearchResult([])
            setSelectedGender(0)
            setSelectedCategory(0)
        }
        dispatch(resetSearchResult())
        dispatch(push(path)) //menu.value
        props.onClose(event)
    }
    const selectLogOut = (event) => {
        props.setReset(props.reset + 1)
        dispatch(resetProductsInCart())
        dispatch(resetSearchResult())
        dispatch(signOut())
        props.onClose(event)
    }

    const menus = [
        { func: selectMenu, label: 'ホーム', icon: <HomeIcon />, id: 'home', value: '/' },
        { func: selectMenu, label: '商品登録', icon: <AddCircleIcon />, id: 'register', value: '/edit' },
        { func: selectMenu, label: '注文履歴', icon: <HistoryIcon />, id: 'history', value: '/order/history' },
        { func: selectMenu, label: 'マイページ', icon: <PersonIcon />, id: 'profile', value: '/user/mypage' },
        { func: selectMenu, label: 'お気に入り', icon: <FavoriteBorderIcon />, id: 'favorites', value: '/favorites' }
    ]

    useEffect(() => {
        db.collection('categories')
            .orderBy('order', 'asc')
            .get()
            .then((snapshots) => {
                const list = []
                snapshots.forEach((snapshot) => {
                    const category = snapshot.data()
                    list.push({
                        func: selectQueryCategory,
                        label: category.name,
                        id: category.id,
                        value: `/?category=${category.id}`
                    })
                })
                setFilters((prevState) => [...prevState, ...list])
            })
    }, [])

    return (
        <nav key={reset} className={classes.drawer}>
            <Drawer
                container={container}
                variant="temporary"
                anchor="right"
                open={props.open}
                onClose={(e) => props.onClose(e)}
                classes={{ paper: classes.drawerPaper }}
                ModalProps={{ keepMounted: true }}
            >
                <div
                    onClose={(e) => props.onColse(e)}
                    onKeyDown={(e) => props.onClose(e)} //e:KeyboardEvent
                >
                    <div className={classes.userName}>Welcome! {userName}</div>
                    <Divider />
                    <List>
                        {menus.map((menu) => (
                            <ListItem button key={menu.id} onClick={(e) => menu.func(e, menu.value)}>
                                <ListItemIcon>{menu.icon}</ListItemIcon>
                                <ListItemText primary={menu.label} />
                            </ListItem>
                        ))}
                        <ListItem button key="logout" onClick={(e) => selectLogOut(e)}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={'ログアウト'} />
                        </ListItem>
                    </List>
                    <Divider />
                    <div className={classes.searchField}>
                        <TextInput
                            fullWidth={true}
                            label={'キーワードを入力'}
                            multiline={false}
                            onChange={onSearch}
                            required={false}
                            rows={1}
                            type={'text'}
                            onKeyPress={(e) => confirmSearch(e)}
                        />
                        <IconButton onClick={(e) => confirmSearch(e)}>
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem
                            button
                            key="all"
                            onClick={(e) => selectQueryGender(e, '/', 0)}
                            selected={selectedGender === 0}
                        >
                            <ListItemText primary="すべて" />
                        </ListItem>
                        <ListItem
                            button
                            key="male"
                            onClick={(e) => selectQueryGender(e, '/?gender=male', 1)}
                            selected={selectedGender === 1}
                        >
                            <ListItemText primary="メンズ" />
                        </ListItem>
                        <ListItem
                            button
                            key="female"
                            onClick={(e) => selectQueryGender(e, '/?gender=female', 2)}
                            selected={selectedGender === 2}
                        >
                            <ListItemText primary="レディース" />
                        </ListItem>
                        <Divider />
                        {filters.map((filter, index) => (
                            <ListItem
                                button
                                key={filter.id}
                                onClick={(e) => filter.func(e, filter.value, index, selectedCategory)}
                                selected={selectedCategory === index}
                            >
                                <ListItemText primary={filter.label} />
                            </ListItem>
                        ))}
                        <Divider />
                        <div style={{ margin: '5px 40px 0 15px' }}>
                            <Typography id="range-slider" gutterBottom>
                                金額指定&emsp;¥{price[0]}〜¥{price[1]}
                            </Typography>
                            <Slider
                                value={price}
                                onChange={handleSlider}
                                valueLabelDisplay="auto"
                                aria-labelledby="range-slider"
                                getAriaValueText={valuetext}
                                marks={marks}
                                step={500}
                                max={50000}
                                min={0}
                            />
                            <div className="abreastContents">
                                <Button
                                    disableElevation
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) => selectRangePrice(e, '/?price=' + price)}
                                >
                                    OK
                                </Button>
                                <Button disableElevation variant="contained" onClick={(e) => selectRangePrice(e, '')}>
                                    リセット
                                </Button>
                            </div>
                        </div>
                    </List>
                </div>
            </Drawer>
        </nav>
    )
}

export default ClosableDrawer
