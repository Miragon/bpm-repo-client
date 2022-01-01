import { SvgIcon } from "@material-ui/core";
import React from "react";

interface Props {
    path: string;
    color: string;
    iconColor: string;
    className: string;
}

const PATH = "m22 0h-17c0 0-5 0-5 5l0 30c0 5 5 5 5 5h20c5 0 5-5 5-5v-27L22 0"

const File: React.FC<Props> = props => {
    return (
        <SvgIcon
            className={props.className}
            viewBox="0 0 30 40">
            <path fill={props.color} d={PATH} />
            <path fill={props.iconColor} d={props.path} />
        </SvgIcon>
    );
};

export default File;
