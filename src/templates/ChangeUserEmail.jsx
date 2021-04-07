import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserData } from '../reducks/users/selectors'
import { TextInput, PrimaryButton } from '../components/UIkit'
import { changeUserEmail } from '../reducks/users/operations'
import { push } from 'connected-react-router'
import '../assets/style.css'
import Divider from '@material-ui/core/Divider'

const ChangeUserEmail = () => {
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const users = getUserData(selector)
    const [userEmail, setUserEmail] = useState(''),
        [password, setPassword] = useState('')

    const inputEmail = useCallback(
        (event) => {
            setUserEmail(event.target.value)
        },
        [setUserEmail]
    )

    const inputPassword = useCallback(
        (event) => {
            setPassword(event.target.value)
        },
        [setPassword]
    )

    return (
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">メールアドレスの変更</h2>
            <div className="module-spacer--medium" />
            <p>
                現在のメールアドレス：
                <br /> {users.email}
            </p>
            <Divider />
            <div className="module-spacer--small" />
            <TextInput
                fullWidth={true}
                label={'新しいメールアドレス'}
                multiline={false}
                require={true}
                rows={1}
                value={userEmail}
                type={'text'}
                onChange={inputEmail}
            />
            <TextInput
                fullWidth={true}
                label={'パスワード'}
                multiline={false}
                require={true}
                rows={1}
                value={password}
                type={'password'}
                onChange={inputPassword}
            />
            <div className="module-spacer--extra-extra-small" />
            <div className="center">
                <PrimaryButton
                    label={'メールアドレスを変更する'}
                    onClick={() => dispatch(changeUserEmail(userEmail, password))}
                />
                <div className="module-spacer--medium" />
                <p onClick={() => dispatch(push('/user/mypage'))} className="textButton">
                    変更せず戻る
                </p>
            </div>
        </div> //このローカルで管理しているstate(username etc...)をdispatchでsignUpメソッドに渡す。
    )
}

export default ChangeUserEmail
