import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
    title: string;
    actions?: {
        icon: React.ReactElement,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }[];
}

const useStyles = makeStyles(() => ({
    section: {
        marginTop: "1rem"
    },
    title: {
        color: "black",
        fontSize: "1.3rem",
        fontWeight: "normal"
    },
    header: {
        display: "flex",
        justifyContent: "space-between"
    },
    actions: {
        display: "flex",
        "&>*": {
            margin: "auto 0"
        },
        "&>*:not(:last-child)": {
            marginRight: "0.5rem"
        }
    }
}));

const Section: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    return (
        <div className={classes.section}>
            <div className={classes.header}>
                <h1 className={classes.title}>{t(props.title)}</h1>
                {props.actions && (
                    <div className={classes.actions}>
                        {props.actions.map(action => (
                            <IconButton onClick={action.onClick}>
                                {action.icon}
                            </IconButton>
                        ))}
                    </div>
                )}
            </div>
            <div>
                {props.children}
            </div>
        </div>
    );
};

export default Section;
