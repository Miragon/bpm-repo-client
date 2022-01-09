import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import FavoriteScreen from "../../screens/Favorite/FavoriteScreen";
import HomeScreen from "../../screens/Home/HomeScreen";
import RecentScreen from "../../screens/Recent/RecentScreen";
import RepositoryDetailsScreen from "../../screens/Repository/RepositoryDetailsScreen";
import RepositoryScreen from "../../screens/Repository/RepositoryScreen";

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
                    path="/repository/:repositoryId"
                    component={RepositoryDetailsScreen} />
                <Route
                    exact
                    path="/repository"
                    component={RepositoryScreen} />
                <Route
                    exact
                    path="/favorite"
                    component={FavoriteScreen} />
                <Route
                    exact
                    path="/recent"
                    component={RecentScreen} />

            </Switch>
        </HashRouter>
    );
};

export default Router;
