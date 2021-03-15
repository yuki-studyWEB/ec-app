import React,{useEffect,useState,useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getUserData,getUserId } from '../reducks/users/selectors';
import {makeStyles} from "@material-ui/styles";
import {Table, TableBody, TableCell, TableContainer, TableRow, Button} from '@material-ui/core';
import {push} from 'connected-react-router';
import { db } from '../firebase';
import {FormDialog} from '../components/UIkit'

const useStyles = makeStyles((theme) => ({
    mypageWrapin: {
        maxWidth: 700,
        margin: "70px auto 0"
    },
    th:{
        width: '22%'
    },
    basedata:{
        lineHeight: 1.7
    },
    button: {
        textAlign: 'center'
    }
}));

const MyPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const users = getUserData(selector);
    const uid = getUserId(selector);
    const [currentUserData, setCurrentUserData] = useState({})
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = useCallback(() => {
        setOpen(false)
    },[setOpen]);

    useEffect(() =>{
        db.collection('users').doc(uid).get()
            .then(snapshot => {
                const data = snapshot.data();
                const fulladdress = data.fulladdress.split("　");
                    setCurrentUserData({
                    ...currentUserData,
                    fullName: data.fullName,
                    fullNameKana: data.fullNameKana,
                    fullPostCode: data.fullPostCode,
                    address1: fulladdress[0],
                    address2: fulladdress[1],
                    address3: fulladdress[2],
                    tel: data.tel
                });
            })
    },[uid])

    return(
        <section className={classes.mypageWrapin}>
        <span className="u-text-large">Mypage（登録者情報）</span>
        <div className="module-spacer--extra-small" />
        <TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className={classes.th} component="th" scope="row">
                            <span className="u-text-medium">ユーザー名</span>
                        </TableCell>
                        <TableCell>
                            <p>{users.username}</p>
                        </TableCell>
                        <TableCell className={classes.button}>
                            <Button 
                                variant="contained" color="secondary"
                                onClick={e =>dispatch(push('/user/mypage/username'))}
                            >
                            変更
                            </Button>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell component="th" scope="row">
                            <span className="u-text-medium">基本情報</span>
                        </TableCell>
                        <TableCell className={classes.basedata}>
                            {Object.keys(currentUserData).length > 0 ? (
                                <div>
                                    {currentUserData.fullName}（{currentUserData.fullNameKana}）
                                    <br/>〒{currentUserData.fullPostCode}
                                    <br/>{currentUserData.address1}　{currentUserData.address2}
                                    <br/>{currentUserData.address3}
                                    <br/>TEL: {currentUserData.tel}
                                </div>
                            ):(
                            <div>基本情報（住所、氏名等）の登録がありません。</div>
                            )}
                        </TableCell>
                        <TableCell className={classes.button}>
                            <Button 
                                variant="contained" color="secondary"
                                onClick={e =>dispatch(push('/user/mypage/userbasedata'))}
                            >
                            変更
                            </Button>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell component="th" scope="row">
                            <span  className="u-text-medium">メールアドレス</span>
                        </TableCell>
                        <TableCell>
                            {users.email}
                        </TableCell>
                        <TableCell className={classes.button}>
                            <Button 
                                variant="contained" color="secondary"
                                onClick={e =>dispatch(push('/user/mypage/useremail'))}
                            >
                            変更
                            </Button>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell component="th" scope="row">
                            <span className="u-text-medium">パスワード</span>
                        </TableCell>
                        <TableCell>

                        </TableCell>
                        <TableCell className={classes.button}>
                            <Button 
                                variant="contained" color="secondary"
                                onClick={e =>dispatch(push('/signin/reset'))}
                            >
                            リセット
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        <div className="module-spacer--extra-small" />
        <p onClick={handleClickOpen} className="textButton">
            お問い合わせ
        </p>
        <FormDialog open={open} handleClose={handleClose}/>
        </section>
    )
}

export default MyPage