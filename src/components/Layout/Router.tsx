import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import HomeScreen from "../../screens/Home/HomeScreen";
import Repository from "../../screens/Repository/Repository";
import RepositoryDetailsScreen from "../../screens/Repository/RepositoryDetailsScreen";

const Router: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Route
                    exact
                    path="/"
                    component={HomeScreen} />
                <Route
                    exact
                    path="/repository2/:repositoryId"
                    component={RepositoryDetailsScreen} />
                <Route
                    exact
                    path="/repository/:repoId"
                    component={Repository} />

            </Switch>
        </HashRouter>
    );
};

export default Router;
