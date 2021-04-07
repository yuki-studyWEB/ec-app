import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserData, getUserId } from '../reducks/users/selectors'
import { makeStyles, withStyles } from '@material-ui/styles'
import { Table, TableBody, TableCell, TableContainer, TableRow, Button } from '@material-ui/core'
import { push } from 'connected-react-router'
import { db } from '../firebase'
import { FormDialog, TableButton, PrimaryButton } from '../components/UIkit'

const useStyles = makeStyles((theme) => ({
    th: {
        width: '22%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            display: 'block'
        }
    },
    basedata: {
        lineHeight: 1.7
    },
    button: {
        textAlign: 'center'
    }
}))

const MyPage = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const users = getUserData(selector)
    const uid = getUserId(selector)
    const [currentUserData, setCurrentUserData] = useState({})
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [setOpen])

    useEffect(() => {
        db.collection('users')
            .doc(uid)
            .get()
            .then((snapshot) => {
                const data = snapshot.data()
                const fulladdress = data.fulladdress.split('　')
                setCurrentUserData({
                    ...currentUserData,
                    fullName: data.fullName,
                    fullNameKana: data.fullNameKana,
                    fullPostCode: data.fullPostCode,
                    address1: fulladdress[0],
                    address2: fulladdress[1],
                    address3: fulladdress[2],
                    tel: data.tel
                })
            })
    }, [uid])

    return (
        <section className="mypage-wrapin">
            <span className="u-text-large">マイページ</span>
            <div className="module-spacer--extra-small" />
            <p className="center">
                <span className="u-text-middle">登録者情報</span>
            </p>
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
                                <TableButton
                                    label={'変更'}
                                    onClick={(e) => dispatch(push('/user/mypage/username'))}
                                ></TableButton>
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
                                        <br />〒{currentUserData.fullPostCode}
                                        <br />
                                        {currentUserData.address1}　{currentUserData.address2}
                                        <br />
                                        {currentUserData.address3}
                                        <br />
                                        TEL: {currentUserData.tel}
                                    </div>
                                ) : (
                                    <div>基本情報（住所、氏名等）の登録がありません。</div>
                                )}
                            </TableCell>
                            <TableCell className={classes.button}>
                                <TableButton
                                    label={'変更'}
                                    onClick={(e) => dispatch(push('/user/mypage/userbasedata'))}
                                ></TableButton>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell component="th" scope="row">
                                <span className="u-text-medium">メールアドレス</span>
                            </TableCell>
                            <TableCell>{users.email}</TableCell>
                            <TableCell className={classes.button}>
                                <TableButton
                                    label={'変更'}
                                    onClick={(e) => dispatch(push('/user/mypage/useremail'))}
                                ></TableButton>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell component="th" scope="row">
                                <span className="u-text-medium">パスワード</span>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className={classes.button}>
                                <TableButton
                                    label={'リセット'}
                                    onClick={(e) => dispatch(push('/signin/reset' + '?id=resetpw'))}
                                ></TableButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="module-spacer--medium" />
            <div className="center">
                <PrimaryButton label={'出品した商品を確認する'} onClick={(e) => dispatch(push('/#myproducts'))} />
            </div>
            <div className="module-spacer--medium" />
            <p onClick={handleClickOpen} className="textButton">
                お問い合わせはこちら
            </p>
            <FormDialog open={open} handleClose={handleClose} />
        </section>
    )
}

export default MyPage
