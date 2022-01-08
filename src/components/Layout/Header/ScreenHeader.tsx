import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { useInView } from "react-intersection-observer";
import { THEME } from "../../../theme";
import ContentLayout from "../ContentLayout";
import { MenuListConfig } from "../MenuList/MenuList";
import AddButton from "./AddButton";
import BreadCrumbNavigation, { BreadcrumbEntry } from "./BreadCrumbNavigation";
import FavoriteButton from "./FavoriteButton";
import MenuButton from "./MenuButton";
import SearchButton from "./SearchButton";

interface Props {
    title: BreadcrumbEntry[];
    addOptions?: MenuListConfig;
    menuOptions?: MenuListConfig;
    onAdd?: (value: string) => void;
    onSearch?: (value: string) => void;
    onFavorite?: (value: boolean) => void;
    onMenu?: (value: string) => void;
    isFavorite?: boolean;
    primary: "add" | "search" | "favorite";
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "sticky",
        top: -1,
        marginTop: "2rem",
        display: "flex",
        flexDirection: "column",
        backgroundColor: THEME.content.background,
        transition: theme.transitions.create("box-shadow"),
        zIndex: 10
    },
    headerStuck: {
        boxShadow: "rgba(0, 0, 0, 0.2) -4px 9px 25px -6px",
        borderBottom: "1px solid transparent !important"
    },
    headerContent: {
        padding: 0
    },
    header: {
        display: "flex",
        position: "relative",
        flexDirection: "row",
        padding: "1rem 0",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid " + THEME.pageHeader.divider,
        transition: theme.transitions.create(["box-shadow", "border"]),
        "&:before": {
            // eslint-disable-next-line
            content: '""',
            display: "block",
            position: "absolute",
            left: "-50px",
            width: "50px",
            height: "100%",
            background: THEME.content.background
        },
        "&:after": {
            // eslint-disable-next-line
            content: '""',
            display: "block",
            position: "absolute",
            right: "-50px",
            width: "50px",
            height: "100%",
            background: THEME.content.background
        }
    },
    actionContainer: {
        display: "flex",
        flexDirection: "row",
        marginRight: "-1rem"
    }
}));

const ScreenHeader: React.FC<Props> = props => {
    const classes = useStyles();

    // Check if the header is completely visible. If it is not, it means it's in stuck mode and
    // we want to apply the box shadow.
    const { ref, inView } = useInView({
        threshold: 1.0,
        initialInView: true
    });

    return (
        <div
            ref={ref}
            className={classes.root}>
            <ContentLayout
                className={classes.headerContent}>
                <div className={clsx(classes.header, !inView && classes.headerStuck)}>
                    <BreadCrumbNavigation title={props.title} />
                    <div className={classes.actionContainer}>
                        {props.onAdd && props.addOptions && (
                            <AddButton
                                addOptions={props.addOptions}
                                onAdd={props.onAdd}
                                primary={props.primary === "add"} />
                        )}
                        {props.onSearch && (
                            <SearchButton
                                onSearch={props.onSearch}
                                primary={props.primary === "search"} />
                        )}
                        {props.onFavorite && (
                            <FavoriteButton
                                onFavorite={props.onFavorite}
                                active={props.isFavorite ?? false}
                                primary={props.primary === "favorite"} />
                        )}
                        {props.onMenu && props.menuOptions && (
                            <MenuButton
                                menuOptions={props.menuOptions}
                                onMenu={props.onMenu} />
                        )}
                    </div>
                </div>
            </ContentLayout>
        </div>
    );
};

export default ScreenHeader;
