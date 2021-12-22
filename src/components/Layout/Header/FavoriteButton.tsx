import { makeStyles, Theme } from "@material-ui/core/styles";
import { StarOutlined, StarOutlineOutlined } from "@material-ui/icons";
import React from "react";
import ActionButton from "./ActionButton";

interface Props {
    onFavorite: (value: boolean) => void;
    primary: boolean;
    active: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({}));

const ScreenHeader: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <ActionButton
            label="Favorit"
            icon={props.active ? StarOutlined : StarOutlineOutlined}
            primary={props.primary}
            active={false} />
    );
};

export default ScreenHeader;
