import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listenAuthState } from './reducks/users/operations'
import { getIsSignedIn } from './reducks/users/selectors'

const Auth = ({ children }) => {
    const dispatch = useDispatch()
    const selector = useSelector((state) => state)
    const isSignedIn = getIsSignedIn(selector)

    useEffect(() => {
        if (!isSignedIn) {
            dispatch(listenAuthState())
        } //もしサインインしていない状態であればlistenAuthStateを呼び出す。
    }, [])

    if (!isSignedIn) {
        return <></>
    } else {
        return children
    } //children サインインしていれば子要素を返す
}

export default Auth
