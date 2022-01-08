import {makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import clsx from "clsx";
import React, {useState} from "react";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    label: string;
    disabled: boolean;
    className?: string;
    required?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChanged: (newValue: any) => void;
}

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: "12px"
    }
}));

const SettingsSelect: React.FC<Props> = props => {
    const classes = useStyles();

    // TODO: Maybe it is easier to just pass the ID to use?
    const [id] = useState(`default-select-${Math.floor(Math.random() * 100_000).toFixed(5)}`);

    return (
        <FormControl
            size="small"
            variant="outlined"
            disabled={props.disabled}
            className={clsx(classes.root, props.className)}
            required={props?.required} >

            <InputLabel id={id}>
                {props.label}
            </InputLabel>

            <Select
                label={props.label}
                labelId={id}
                value={props.value}
                onChange={e => props.onChanged(e.target.value)}>
                {props.children}
            </Select>

        </FormControl>
    );
};

export default SettingsSelect;
