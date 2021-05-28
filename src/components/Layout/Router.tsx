import React from "react";
import {Route, Switch} from "react-router-dom";
import Overview from "../../screens/Overview";
import Repository from "../../screens/Repository";

const Router: React.FC = () => {
    return (
        <Switch>
            <Route
                exact path="/"
                component={Overview}/>

            <Route exact path ="/repository"
                   component={Repository}/>
        </Switch>
    );
};

export default Router;
