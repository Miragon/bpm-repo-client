import { StarOutlined, StarOutlineOutlined } from "@material-ui/icons";
import React from "react";
import ActionButton from "./ActionButton";

interface Props {
    onFavorite: (value: boolean) => void;
    primary: boolean;
    active: boolean;
}

const FavoriteButton: React.FC<Props> = props => {
    return (
        <ActionButton
            label="Favorit"
            onClick={() => props.onFavorite(!props.active)}
            icon={props.active ? StarOutlined : StarOutlineOutlined}
            primary={props.primary}
            active={props.active} />
    );
};

export default FavoriteButton;
