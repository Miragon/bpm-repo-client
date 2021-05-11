import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import React from "react";

interface Props {
    type?: React.InputHTMLAttributes<unknown>["type"];
    onChanged?: (newValue: string) => void;
    className?: string;
    disabled?: boolean;
    label: string;
    value: string;
    multiline?: boolean;
    rows?: number;
    rowsMax?: number;
    spellCheck?: boolean;
}

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: "12px"
    }
}));

const SettingsTextField: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <TextField
            label={props.label}
            variant="outlined"
            spellCheck={props.spellCheck}
            size="small"
            type={props.type}
            multiline={props.multiline}
            rows={props.rows}
            rowsMax={props.rowsMax}
            className={clsx(classes.root, props.className)}
            disabled={props.disabled}
            onChange={e => props.onChanged && props.onChanged(e.target.value)}
            value={props.value} />
    );
};

export default SettingsTextField;
