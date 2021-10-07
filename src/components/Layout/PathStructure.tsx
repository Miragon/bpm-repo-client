import {Breadcrumbs} from "@material-ui/core";
import React from "react";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import theme from "../../theme";

const useStyles = makeStyles(() => ({
    link: {
        cursor: "pointer",
        color: theme.palette.primary.main,
        fontWeight: "lighter",
        "&:hover": {
            color: theme.palette.primary.light,
            textDecoration: "underline",
        }
    }
})
)

interface Props {
    structure: Array<CrumbElement>;
}

export interface CrumbElement {
    name: string;
    onClick: () => void;
}


const PathStructure: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");


    return (
        <Breadcrumbs separator="›">
            {props.structure.map(crumb => (
                <div className={classes.link}
                    key={crumb.name}
                    color="inherit"
                    onClick={crumb.onClick}>
                    {t(crumb.name)}
                </div>
            ))}
        </Breadcrumbs>
    );
};

export default PathStructure;
