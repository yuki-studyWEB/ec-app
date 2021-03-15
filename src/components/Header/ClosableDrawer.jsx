import React,{useEffect,useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {useDispatch,useSelector} from 'react-redux';
import {push} from 'connected-react-router';
import {getUsername} from '../../reducks/users/selectors'
import {Drawer, List, Divider, ListItem, ListItemIcon, ListItemText, IconButton} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HistoryIcon from '@material-ui/icons/History';
import PersonIcon from '@material-ui/icons/Person';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {TextInput} from '../UIkit/index'
import {signOut} from '../../reducks/users/operations'
import {reflectSearchResult} from '../../reducks/products/operations';
import {db} from '../../firebase/index'
const algoliasearch = require("algoliasearch");
const client = algoliasearch(
  process.env.REACT_APP_ALGOLIA_ID,
  process.env.REACT_APP_ADMIN_API_KEY
);
const index = client.initIndex("ecProducts");
const useStyles = makeStyles((theme)=>({
    drawer: {
        [theme.breakpoints.up('sm')]: {
            flexShrink: 0,
            width:256
        }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        [theme.breakpoints.up('sm')]: {
            width: 256
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
    const classes = useStyles();
    const dispatch = useDispatch();
    const seletor = useSelector((state)=>state);
    const userName = getUsername(seletor)
    const {container} = props;
    const [searchResult, setSearchResult] = useState([])

    const onSearch = async(e) => {
        let tempResults = [];
        await index
        .search(e.target.value)
        .then(responses => {
            tempResults = responses.hits;
        });
        setSearchResult(tempResults);
    }

    const confirmSearch = (event) => {
        if(event.key === "Enter"|| event.type === "click"){
            if (window.location.pathname !== ""){
                dispatch(push('/'))
            }
            dispatch(reflectSearchResult(searchResult));
            props.onClose(event);
        }
    } 

    const selectMenu = (event, path) => {
        dispatch(push(path)) //menu.value
        props.onClose(event)
    }
    const selectLogOut = (event) => {
        dispatch(signOut())
        props.onClose(event)
    }

    const [filters, setFilters] = useState([
        {func: selectMenu, label:"すべて", id: "all", value: "/"},
        {func: selectMenu, label:"メンズ", id: "male", value: "/?gender=male"},
        {func: selectMenu, label:"レディース", id: "female", value: "/?gender=female"},
    ])

    const menus = [
        {func: selectMenu, label:"商品登録",    icon:<AddCircleIcon />,     id: "register", value: "/product/edit"},
        {func: selectMenu, label:"注文履歴",    icon:<HistoryIcon />,       id: "history",  value: "/order/history"},
        {func: selectMenu, label:"プロフィール", icon:<PersonIcon />,        id: "profile",  value: "/user/mypage"},
        {func: selectMenu, label:"お気に入り",   icon:<FavoriteBorderIcon />,id: "favorites",  value: "/favorites"}
    ]

    useEffect(() =>{
        db.collection('categories')
            .orderBy('order','asc')
            .get()
            .then(snapshots =>{
                const list = [];
                snapshots.forEach(snapshot => {
                    const category = snapshot.data()
                    list.push({func: selectMenu, label: category.name, id: category.id, value: `/?category=${category.id}`})
                })
                setFilters(prevState => [...prevState, ...list])
            })
    },[])

    return (
        <nav className={classes.drawer}>
            <Drawer
                container={container}
                variant="temporary"
                anchor="right"
                open={props.open}
                onClose={(e) => props.onClose(e)}
                classes={{paper: classes.drawerPaper}}
                ModalProps={{keepMounted: true}}
            >
            <div
                onClose={(e) => props.onColse(e)}
                onKeyDown={(e)=>props.onClose(e)}//e:KeyboardEvent
            >
                <div className={classes.userName}>
                    Welcome! {userName}
                    
                </div>
                <Divider />
                <div className={classes.searchField}>
                    <TextInput
                        fullWidth={true} label={"キーワードを入力"} multiline={false}
                        onChange={onSearch} required={false} rows={1} type={"text"}
                        onKeyPress={(e) => confirmSearch(e)}
                    />
                    <IconButton>
                        <SearchIcon button onClick={(e) => confirmSearch(e)}/>
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {menus.map(menu => (
                        <ListItem button key={menu.id} onClick={(e) => menu.func(e, menu.value)}>
                            <ListItemIcon>
                                {menu.icon}
                            </ListItemIcon>
                            <ListItemText primary={menu.label} />
                        </ListItem>
                    ))}
                    <ListItem button key="logout" onClick={(e) => selectLogOut(e)}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={"ログアウト"} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {filters.map(filter => (
                        <ListItem
                            button
                            key={filter.id}
                            onClick={(e) => filter.func(e, filter.value)}
                            >
                            <ListItemText primary={filter.label} />
                        </ListItem>
                    ))}
                </List>
            </div>
            </Drawer>
        </nav>
    )
}

export default ClosableDrawer