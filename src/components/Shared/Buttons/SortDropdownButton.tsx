import {
    Button,
    ClickAwayListener,
    FormControlLabel,
    Grow,
    MenuList,
    Paper,
    Popper,
    Radio,
    RadioGroup
} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {ArrowDropDown} from "@material-ui/icons";
import clsx from "clsx";
import React, {useRef, useState} from "react";
import {DropdownButtonItem} from "../Form/DropdownButton";

interface Props {
    testId?: string;
    title: string;
    options: DropdownButtonItem[];
    sortValue: string;
    onClick?: (id: string) => void;
    className?: string;
    disabled?: boolean;
    defaultValue?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        textTransform: "none",
        fontWeight: 600,
        transition: theme.transitions.create("border-radius"),
        "&:hover": {
            backgroundColor: theme.palette.secondary.main
        }
    },
    buttonActive: {
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px"
    },
    popupContainer: {
        zIndex: 100
    },
    popup: {
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        minWidth: "max-content",
        backgroundColor: theme.palette.secondary.main,
    },
    menuItem: {
        color: theme.palette.secondary.contrastText,
        fontSize: theme.typography.button.fontSize,
        margin: "0px",
        paddingRight: "10px",
        fontWeight: theme.typography.button.fontWeight,
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
        }
    },
    list: {
        outline: "none",
        display: "flex",
        flexDirection: "column",
    },
    menuItemHint: {
        whiteSpace: "break-spaces",
        fontSize: "0.85rem",
        color: "white",
        fontWeight: "normal",
        opacity: "1 !important",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        marginTop: "0.5rem",
        marginBottom: "1rem"
    },
    menuItemDivider: {
        height: "1px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        opacity: "1 !important",
        marginTop: "0.25rem",
        marginBottom: "0.25rem",
        padding: 0
    }
}));

const SortDropdownButton: React.FC<Props> = props => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);

    if (!props.onClick && props.options.find(option => !option.onClick)) {
        throw new Error("You must either pass a global onClick listener or each option needs a special one!");
    }

    return (
        <>
            <Button
                ref={ref}
                color="secondary"
                className={clsx(classes.button, open && classes.buttonActive, props.className)}
                disabled={props.disabled}
                onClick={() => setOpen(true)}
                variant="contained"
                endIcon={<ArrowDropDown/>}>
                {props.title}
            </Button>
            <Popper
                open={open}
                anchorEl={ref.current}
                role={undefined}
                transition
                disablePortal
                style={{width: ref.current?.offsetWidth}}
                className={classes.popupContainer}>
                {({TransitionProps}) => (
                    <Grow
                        {...TransitionProps}
                        style={{transformOrigin: "top"}}>
                        <Paper className={classes.popup}>
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <MenuList className={classes.list}>
                                    <RadioGroup
                                        defaultValue={props.defaultValue} >
                                        {props.options.map(option => (
                                            <FormControlLabel
                                                key={option.id}
                                                className={classes.menuItem}
                                                value={option.id}
                                                label={option.label}
                                                control={
                                                    <Radio
                                                        color={"primary"}
                                                        onChange={() => {
                                                            if (option.onClick) {
                                                                option.onClick();
                                                            } else if (props.onClick) {
                                                                props.onClick(option.id);
                                                            }}
                                                        }
                                                        value={option.id}/>} />

                                        ))}
                                    </RadioGroup>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
};

export default SortDropdownButton;
