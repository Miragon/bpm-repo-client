import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/styles";
import {useTranslation} from "react-i18next";
import {ArtifactVersionUploadTOSaveTypeEnum} from "../../../../api";
import {createVersion, getLatestVersion} from "../../../../store/actions";
import PopupDialog from "../../../../components/Form/PopupDialog";
import {
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    SYNC_STATUS_VERSION
} from "../../../../constants/Constants";
import SettingsForm from "../../../../components/Form/SettingsForm";
import SettingsTextField from "../../../../components/Form/SettingsTextField";
import helpers from "../../../../util/helperFunctions";

const useStyles = makeStyles(() => ({
    container: {}
}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    onCreated: () => void;
    artifactId: string;
    artifactTitle: string;
}

const CreateVersionDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");

    const {
        open, onCancelled, artifactId, artifactTitle
    } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [comment, setComment] = useState("");



    const onCreate = useCallback(async () => {
        getLatestVersion(artifactId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                createVersion(artifactId, response.data.file, ArtifactVersionUploadTOSaveTypeEnum.Milestone, comment).then(response2 => {
                    if (Math.floor(response2.status / 100) === 2) {
                        dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false});
                        dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false});
                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                        dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                        helpers.makeSuccessToast(t("version.created"));
                        onCancelled()
                    } else {
                        helpers.makeErrorToast(response2.data.toString(), () => getLatestVersion(artifactId))
                    }
                }, error => {
                    helpers.makeErrorToast(t(error.response.data), () => getLatestVersion(artifactId))

                })
            } else {
                helpers.makeErrorToast(response.data.toString(), () => getLatestVersion(artifactId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getLatestVersion(artifactId))
        })

    }, [artifactId, comment, dispatch, onCancelled, t])

    return (
        <PopupDialog
            className={classes.container}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("version.dialogHeader", {artifactName: artifactTitle})}
            secondTitle={t("dialog.cancel")}
            onSecond={onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={() => onCreate()}>

            <SettingsForm large>

                <SettingsTextField
                    label={t("properties.comment")}
                    value={comment}
                    multiline
                    rows={2}
                    rowsMax={2}
                    onChanged={setComment} />
            </SettingsForm>

        </PopupDialog>
    );
};

export default CreateVersionDialog;
