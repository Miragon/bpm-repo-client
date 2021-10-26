import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import Overview from "../../screens/Overview/Overview";
import Repository from "../../screens/Repository/Repository";

const Router: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Route
                    exact
                    path="/"
                    component={Overview}/>
                <Route
                    exact
                    path="/repository/:repoId"
                    component={Repository}/>

            </Switch>
        </HashRouter>
    );
};

export default Router;
