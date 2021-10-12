import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Overview from "../../screens/Overview/Overview";
import Repository from "../../screens/Repository/Repository";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    exact
                    path="/repository"
                    component={Overview}/>
                <Route
                    exact
                    path="/repository/:repoId"
                    component={Repository}/>

            </Switch>
        </BrowserRouter>
    );
};

export default Router;
