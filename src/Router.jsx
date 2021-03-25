import React from 'react';
import {Route, Switch} from "react-router";
import {CartList,FavoriteList, OrderConfirm,OrderHistory, SignUp, SignIn, MyPage, ChangeUserName,ChangeUserBaseData,ChangeUserEmail, ProductList, Reset, ProductEdit,ProductDetail} from "./templates";
import Auth from './Auth'

const Router = () => {
    return (
        <Switch>
            <Route exact path={"/signup"} component={SignUp} />
            <Route exact path={"/signin"} component={SignIn} />
            <Route exact path={"/signin/reset"} component={Reset} />
            <Auth>
                <Route exact path={"(/)?"} component={ProductList} />
                <Route exact path={"/product/:id"} component={ProductDetail} />
                <Route path={"/edit(/:id)?"} component={ProductEdit} />

                <Route exact path={"/cart"} component={CartList} />
                <Route exact path={"/order/confirm"} component={OrderConfirm} />
                <Route exact path={"/order/history"} component={OrderHistory} />
                <Route exact path={"/favorites"} component={FavoriteList} />

                <Route exact path={"/user/mypage"} component={MyPage} />
                <Route exact path={"/user/mypage/username"} component={ChangeUserName} />
                <Route exact path={"/user/mypage/userbasedata"} component={ChangeUserBaseData} />
                <Route exact path={"/user/mypage/useremail"} component={ChangeUserEmail} />
            </Auth>
        </Switch>// exactをつけるとURLが完全一致が条件になる。()?で囲んだ文字列はあってもなくてもマッチ。:idは変数扱い
    )   //認証していないと見れないページは<Auth>で囲む
}

export default Router