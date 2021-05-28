import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import MenuBar from "../Menu/MenuBar";
import AppMenu from "./Menu/AppMenu";
import logo from "../../img/logo-free.png";

const useStyles = makeStyles(() => ({
    icon: {
        height: "40px",
        margin: "0 auto"
    }
}));

const Menu: React.FC = () => {
    const classes = useStyles();

    return (
        <MenuBar>
            <AppMenu />
            <img className={classes.icon} src={logo} />
        </MenuBar>

    );
}

export default Menu;
