import React from 'react';
import {Route, Switch} from "react-router";
import {SignUp, SignIn, Home, Reset, ProductEdit} from "./templates";
import Auth from './Auth'

const Router = () => {
    return (
        <Switch>
            <Route exact path={"/signup"} component={SignUp} />
            <Route exact path={"/signin"} component={SignIn} />
            <Route exact path={"/signin/reset"} component={Reset} />
            <Auth>
                <Route exact path={"(/)?"} component={Home} />
                <Route exact path={"/product/edit"} component={ProductEdit} />
            </Auth>
        </Switch>// exactをつけるとURLが完全一致した場合componentを表示するよ。(/)?にするとスラッシュがあってもなくてもいいよという意味
    )   //認証していないと見れないページは<Auth>で囲む
}

export default Router