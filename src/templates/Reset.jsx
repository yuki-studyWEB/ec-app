import React,{useCallback, useState} from 'react';
import { useDispatch } from 'react-redux';
import { TextInput,PrimaryButton } from '../components/UIkit';
import {resetPassword} from '../reducks/users/operations'
import {push} from 'connected-react-router'

const Reset = () => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState("");

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    },[setEmail]); 

    return(
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">パスワードリセット</h2>
            <div className="module-spacer--medium" />
            <TextInput
                fullWidth={true} label={"送信先メールアドレス"} multiline={false} require={true}
                rows={1} value={email} type={"email"} onChange={inputEmail}
            />
            <div className="center">
                <PrimaryButton
                    label={"パスワードリセット"}
                    onClick={() => dispatch(resetPassword(email))}
                />
                <div className="module-spacer--medium" />
                <p onClick={()=>dispatch(push('/signin'))}>ログイン画面に戻る</p>
            </div>
        </div>//このローカルで管理しているstate(username etc...)をdispatchでsignUpメソッドに渡す。
    )
}

export default Reset