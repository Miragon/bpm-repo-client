import { makeStyles } from "@material-ui/styles";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
    title: string;
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
    container: {}
}));

const Section: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    return (
        <div className={classes.section}>
            <h1 className={classes.title}>{t(props.title)}</h1>
            <div className={classes.container}>
                {props.children}
            </div>
        </div>
    );
};

export default Section;
