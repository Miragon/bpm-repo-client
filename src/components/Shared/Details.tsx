import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/styles";
import theme from "../../theme";
import {RepositoryTO, TeamTO} from "../../api";
import React, {useState} from "react";
import Section from "../../components/Layout/Section";
import {Settings} from "@material-ui/icons";


const useStyles = makeStyles(() => ({
    description: {
        fontStyle: "italic",
        color: theme.palette.text.secondary,
        fontSize: "1rem",
        paddingBottom: "1rem"
    }
}))

interface Props {
    object: TeamTO | RepositoryTO;
}


const Details: React.FC<Props> = (props => {
    const classes = useStyles();


    return (
        <Section
            title={props.object.name} >
            <div className={classes.description}>
                {props.object.description}
            </div>
        </Section>
    )
})

export default Details;