import { Popover } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useHistory } from "react-router-dom";
import flowSquadIcon from "../../FlowSquadLogo.svg";
import MenuBar from "../Menu/MenuBar";
import MenuLogo from "../Menu/MenuLogo";
import AppMenu from "./Menu/AppMenu";

const useStyles = makeStyles((theme) => ({
    menuComponent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.primary.main,
        paddingLeft: "30px",
        paddingRight: "30px",
    },
    menu: {
        height: "100%",
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "960px",
        margin: "0 auto"
    },
    userIcon: {
        position: "absolute",
        cursor: "pointer",
        right: "5%",
        color: "white",
        height: "28px"
    },
    addButton: {
        position: "absolute",
        cursor: "pointer",
        top: "10%",
        left: "110px",
        color: "white",
        backgroundColor: theme.palette.primary.main,
        height: "80%",
        width: "180px",
        border: "1px solid white",
        borderRadius: "5px",
        transition: "background-color .3s, color .3s, border .3s",
        "&:hover": {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            border: "1px solid " + theme.palette.primary.main

        }
    },

    addIcon: {
        position: "absolute",
        left: "0px",
        top: "0px",
        width: "35px",
        height: "35px",

    },
    buttonText: {
        position: "absolute",
        top: "10px",
        left: "40px",
        display: "inline-block",
        fontSize: "16px"
    },
    dropdownContent: {
        display: "flex",
        width: "200px",
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: "white",
        fontSize: "16px",
        fontFamily: "arial",
        boxShadow: "0 0 11px rgba(33,33,33,.2)"
    },
    dropdownItem: {
        padding: "10px",
        color: "black",
        textDecoration: "none",
        transition: "background-color .3s",
        "&:hover": {
            backgroundColor: "#e3e3e3"
        }
    },
    flowSquadIcon: {
        position: "absolute",
        right: "5%",
        height: "25px",

    },
    spacer: {
        flexGrow: 1
    }
}));

const Menu: React.FC = () => {

    const classes = useStyles();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorImport, setAnchorImport] = React.useState(null);

    const handleClickAdd = (event: React.BaseSyntheticEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickUpload = (event: React.BaseSyntheticEvent) => {
        setAnchorImport(event.currentTarget)
    }

    const handleCloseImport = () => {
        setAnchorImport(null);
    }


    const open = Boolean(anchorEl);
    const openImport = Boolean(anchorImport);
    const id = open ? 'simple-popover' : undefined;
    const idImport = openImport ? 'simple-popover-import' : undefined;


    return (
        <MenuBar>
            <AppMenu />
            <div className={classes.menu}>
                <MenuLogo onClick={() => history.push("/")} />
            </div>
            <div>
                <Dropdown>
                    <Dropdown.Toggle className={classes.addButton}>
                        {React.createElement(Add, {
                            className: classes.addIcon
                        })}
                        <div className={classes.buttonText}>Create New File</div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className={classes.dropdownContent}>
                        <Dropdown.Item className={classes.dropdownItem} onClick={handleClickAdd}>New
                            BPMN Diagram</Dropdown.Item>
                        <Popover
                            id={idImport}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                        </Popover>
                        <Dropdown.Item className={classes.dropdownItem}>New DMN</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className={classes.dropdownItem} onClick={handleClickUpload}>Import
                            File</Dropdown.Item>
                        <Popover
                            id={id}
                            open={openImport}
                            anchorEl={anchorImport}
                            onClose={handleCloseImport}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                        </Popover>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <img className={classes.flowSquadIcon} src={flowSquadIcon} />
        </MenuBar>

    );
}

export default Menu;


/*
 <CreateDiagramForm
 active={true}
 ></CreateDiagramForm>
 */
