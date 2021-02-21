import { GraphicEq } from '@material-ui/icons';
import React,{useCallback, useState} from 'react';
import { useDispatch } from 'react-redux';
import { TextInput,PrimaryButton } from '../components/UIkit';
import {signIn} from '../reducks/users/operations'
import {push} from 'connected-react-router'

const SignIn = () => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState(""),
          [password, setPassword] = useState("");

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value)
    },[setEmail]); 
    
    const inputPassword = useCallback((event) => {
        setPassword(event.target.value)
    },[setPassword]);

    return(
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">サインイン</h2>
            <div className="module-spacer--medium" />
            <TextInput
                fullWidth={true} label={"メールアドレス"} multiline={false} require={true}
                rows={1} value={email} type={"email"} onChange={inputEmail}
            />
            <TextInput
                fullWidth={true} label={"パスワード"} multiline={false} require={true}
                rows={1} value={password} type={"password"} onChange={inputPassword}
            />
            <div className="center">
                <PrimaryButton
                    label={"SignIn"}
                    onClick={() => dispatch(signIn(email, password))}
                />
                <div className="module-spacer--medium" />
                <p onClick={() => dispatch(push('/signup'))}>SignUp</p>
                <p onClick={() => dispatch(push('/signin/reset'))}>パスワードをお忘れの方はこちら</p>
            </div>
        </div>//このローカルで管理しているstate(username etc...)をdispatchでsignUpメソッドに渡す。
    )
}

export default SignIn