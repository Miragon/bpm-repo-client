import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Input, InputLabel} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {updateArtifact} from "../../../../store/actions";
import PopupDialog from "../../../../components/Form/PopupDialog";
import {SYNC_STATUS_ARTIFACT} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";

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
        updateArtifact(title, description, props.artifactId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false})
                helpers.makeSuccessToast(t("artifact.changed"))
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => applyChanges())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => applyChanges())
        })
    }, [title, description, props.artifactId, dispatch, t]);

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
