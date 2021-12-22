import { makeStyles, Theme } from "@material-ui/core/styles";
import { SearchOutlined } from "@material-ui/icons";
import React from "react";
import ActionButton from "./ActionButton";

interface Props {
    onSearch: (value: string) => void;
    primary: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({}));

const ScreenHeader: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <ActionButton
            label="Suchen"
            icon={SearchOutlined}
            primary={props.primary}
            active={false} />
    );
};

export default ScreenHeader;
