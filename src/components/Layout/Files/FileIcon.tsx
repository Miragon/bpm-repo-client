import { makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import File from "../../Icons/File";
import { BpmnIcon, ConfigurationIcon, DmnIcon, FormIcon, UnknownIcon } from "../../Icons/FileIcons";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        fontSize: "2rem"
    }
}));

interface Props {
    type: string;
    color: string;
    iconColor: string;
    className?: string;
}

const ICONS: { [key: string]: string } = {
    bpmn: BpmnIcon,
    dmn: DmnIcon,
    configuration: ConfigurationIcon,
    form: FormIcon,
    unknown: UnknownIcon
};

const FileIcon: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <File
            className={clsx(classes.root, props.className)}
            color={props.color}
            iconColor={props.iconColor}
            path={ICONS[props.type.toLowerCase()] || ICONS.unknown} />
    );
};

export default FileIcon;
