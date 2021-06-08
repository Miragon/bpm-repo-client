import React from "react";
import {Route, Switch} from "react-router-dom";
import Overview from "../../screens/Overview/Overview";
import Repository from "../../screens/Repository/Repository";

const Router: React.FC = () => {
    return (
        <Switch>
            <Route
                exact path="/"
                component={Overview}/>

            <Route exact path ="/repository/:repoId"
                   component={Repository}/>
        </Switch>
    );
};

export default Router;
