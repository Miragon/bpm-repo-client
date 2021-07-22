import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Input, InputLabel} from "@material-ui/core";
import * as artifactAction from "../../../store/actions/artifactAction";
import PopupDialog from "../../../components/Form/PopupDialog";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    line: {
        display: "flex",
        flexDirection: "column"
    },
    property: {
        flexBasis: "20px"
    },
    spacer: {
        marginTop: "15px"
    }

}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
    artifactId: string;
    artifactName: string;
    artifactDescription: string;
}

const EditArtifactDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>(props.artifactName);
    const [description, setDescription] = useState<string>(props.artifactDescription);

    const applyChanges = useCallback(async () => {
        try {
            dispatch(artifactAction.updateArtifact(title, description, props.artifactId));
            props.onCancelled();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [title, description, props, dispatch]);

    return (
        <PopupDialog
            open={props.open}
            title={props.artifactName}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("dialog.applyChanges")}
            onFirst={applyChanges}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}>
            <InputLabel style={{ fontSize: "12px" }} htmlFor="Title">{t("properties.title")}</InputLabel>
            <Input
                id="Name"
                value={title}
                onChange={event => setTitle(event.target.value)} />
            <div className={classes.spacer} />
            <InputLabel style={{ fontSize: "12px" }} htmlFor="Description">{t("properties.description")}</InputLabel>
            <Input
                id="Description"
                value={description}
                multiline
                rows={4}
                onChange={event => setDescription(event.target.value)} />

        </PopupDialog>
    );
};

export default EditArtifactDialog;
