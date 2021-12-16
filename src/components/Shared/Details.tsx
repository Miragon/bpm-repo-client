import { makeStyles } from "@material-ui/styles";
import React from "react";
import theme from "../../theme";
import { RepositoryTO } from "../../api";
import Section from "../Layout/Section";

const useStyles = makeStyles(() => ({
    description: {
        color: theme.palette.text.secondary,
        fontSize: "1rem",
        paddingBottom: "1rem"
    }
}));

interface Props {
    object: RepositoryTO;
}

const Details: React.FC<Props> = (props => {
    const classes = useStyles();

    return (
        <Section
            title={props.object.name}>
            <div className={classes.description}>
                {props.object.description}
            </div>
        </Section>
    );
});

export default Details;
