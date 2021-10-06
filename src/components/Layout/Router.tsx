import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Overview from "../../screens/Overview/Overview";
import Repository from "../../screens/Repository/Repository";
import Team from "../../screens/Team/Team";

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
                <Route
                    exact
                    path="/repository/team/:teamId"
                    component={Team}/>

            </Switch>
        </BrowserRouter>
    );
};

export default Router;
