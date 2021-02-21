import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {getUserId, getUsername} from '../reducks/users/selectors'
import {signOut} from "../reducks/users/operations"

const Home = () => {
    const dispatch = useDispatch();
    const selector = useSelector(state =>state);
    //getUserIdの関数の引数にはstore全体のstateを取得する必要がある。useSelecor
    const uid = getUserId(selector)
    const username = getUsername(selector)

    return(
        <div>
            <h2>Home</h2>
            <p>ユーザーID：{uid}</p>
            <p>ユーザー名：{username}</p>
            <button onClick={() => dispatch(signOut())}>SignOut</button>
        </div>
    )
}

export default Home