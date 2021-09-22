import React from "react";
import {Route, Switch} from "react-router-dom";
import Overview from "../../screens/Overview/Overview";
import Repository from "../../screens/Repository/Repository";
import Team from "../../screens/Team/Team";

const Router: React.FC = () => {
    return (
        <Switch>
            <Route
                exact
                path="/"
                component={Overview}/>
            <Route
                exact
                path="/repository/:repoId"
                component={Repository}/>
            <Route
                exact
                path="/team/:teamId"
                component={Team}/>

        </Switch>
    );
};

export default Router;
