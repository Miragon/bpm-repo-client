import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";

interface Props {
    onChanged: (checked: boolean) => void;
    className?: string;
    disabled: boolean;
    checked: boolean;
    label: string;
}

// eslint-disable-next-line arrow-body-style
const SettingsCheckbox: React.FC<Props> = props => {
    return (
        <FormControlLabel
            disabled={props.disabled}
            label={props.label}
            className={props.className}
            control={(
                <Checkbox
                    disabled={props.disabled}
                    checked={props.checked}
                    onChange={(e, checked) => props.onChanged(checked)}
                    color="primary" />
            )} />
    );
};

export default SettingsCheckbox;
