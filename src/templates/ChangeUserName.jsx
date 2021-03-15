import React,{useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getUserData } from '../reducks/users/selectors';
import { TextInput,PrimaryButton } from '../components/UIkit';
import {changeUserName} from '../reducks/users/operations';
import {push} from 'connected-react-router';
import '../assets/style.css'
import Divider from "@material-ui/core/Divider";

const ChangeUserName = () => {
    const dispatch = useDispatch()
    const selector = useSelector((state) => state);
    const users = getUserData(selector);
    const [username, setUsername] = useState(""),
          [password, setPassword] = useState("");

    const inputUsername = useCallback((event) => {
        setUsername(event.target.value)
    },[setUsername]);
    
    const inputPassword = useCallback((event) => {
        setPassword(event.target.value)
    },[setPassword]);

    return(
        <div className="c-section-container">
            <h2 className="u-text__headline u-text-center">ユーザー名の変更</h2>
            <div className="module-spacer--medium" />
            <p>現在のユーザー名： {users.username}</p>
            <Divider />
            <div className="module-spacer--small" />
            <TextInput
                fullWidth={true} label={"新しいユーザー名"} multiline={false} require={true}
                rows={1} value={username} type={"text"} onChange={inputUsername}
            />
            <TextInput
                fullWidth={true} label={"パスワード"} multiline={false} require={true}
                rows={1} value={password} type={"password"} onChange={inputPassword}
            />
            <div className="module-spacer--extra-extra-small" />
            <div className="center">
                <PrimaryButton
                    label={"ユーザー名を変更する"}
                    onClick={() => dispatch(changeUserName(username, password))}
                />
                <div className="module-spacer--medium" />
                <p onClick={()=>dispatch(push('/user/maypage'))} className="textButton">
                    変更せず戻る
                </p>
            </div>
        </div>//このローカルで管理しているstate(username etc...)をdispatchでsignUpメソッドに渡す。
    )
}

export default ChangeUserName