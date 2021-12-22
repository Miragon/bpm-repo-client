import { SvgIcon } from "@material-ui/core";
import React from "react";

interface Props {
    className?: string;
}

const PATH = "M89 659l0-617 822 0 0 617-822 0z m35-209l159 0 0-173-159 0 0 173z m194 0l558 0 0-173-558 0 0 173z m-194-208l159 0 0-165-159 0 0 165z m194 0l558 0 0-165-558 0 0 165z";

const FileDmn: React.FC<Props> = props => {
    return (
        <SvgIcon
            viewBox="-10 0 1000 1010"
            className={props.className}>
            <path d={PATH} />
        </SvgIcon>
    );
};

export default FileDmn;
