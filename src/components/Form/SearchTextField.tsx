import {IconButton, InputAdornment, TextField} from "@material-ui/core";
import {Clear} from "@material-ui/icons";
import React from "react";

interface Props {
    label: string;
    search: string;
    className?: string;
    onSearchChanged: (value: string) => void;
}

const SearchTextField: React.FC<Props> = props => {
    return (
        <TextField
            className={props.className}
            size="small"
            variant="outlined"
            label={props.label}
            value={props.search}
            onChange={e => props.onSearchChanged(e.target.value)}
            InputProps={{
                endAdornment: props.search ? (
                    <InputAdornment position="end">
                        <IconButton
                            size="small"
                            onClick={() => props.onSearchChanged("")}>
                            <Clear />
                        </IconButton>
                    </InputAdornment>
                ) : undefined,
            }} />
    );
};

export default SearchTextField;
