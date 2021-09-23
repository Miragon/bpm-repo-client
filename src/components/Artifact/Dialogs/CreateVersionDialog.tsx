import {makeStyles} from "@material-ui/styles";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {ArtifactTO, ArtifactVersionUploadTOSaveTypeEnum} from "../../../api";
import {createVersion, getLatestVersion} from "../../../store/actions";
import {
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    SYNC_STATUS_VERSION
} from "../../../constants/Constants";
import helpers from "../../../util/helperFunctions";
import PopupDialog from "../../Shared/Form/PopupDialog";
import SettingsForm from "../../Shared/Form/SettingsForm";
import SettingsTextField from "../../Shared/Form/SettingsTextField";

const useStyles = makeStyles(() => ({
    container: {}
}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    onCreated: () => void;
    artifact: ArtifactTO | undefined;
}

const CreateVersionDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation("common");

    const {
        open, onCancelled, artifact
    } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [comment, setComment] = useState("");

    const onCreate = useCallback(async () => {
        if (!artifact) {
            return;
        }

        getLatestVersion(artifact.id).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                createVersion(artifact.id, response.data.file, ArtifactVersionUploadTOSaveTypeEnum.Milestone, comment).then(response2 => {
                    if (Math.floor(response2.status / 100) === 2) {
                        dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                        dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                        dispatch({ type: SYNC_STATUS_RECENT, dataSynced: false })
                        dispatch({ type: SYNC_STATUS_VERSION, dataSynced: false });
                        helpers.makeSuccessToast(t("version.created"));
                        onCancelled()
                    } else {
                        helpers.makeErrorToast(response2.data.toString(), () => getLatestVersion(artifact.id))
                    }
                }, error => {
                    helpers.makeErrorToast(t(error.response.data), () => getLatestVersion(artifact.id))

                })
            } else {
                helpers.makeErrorToast(response.data.toString(), () => getLatestVersion(artifact.id))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getLatestVersion(artifact.id))
        })

    }, [artifact, comment, dispatch, onCancelled, t])

    return (
        <PopupDialog
            className={classes.container}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("version.dialogHeader", { artifactName: artifact?.name })}
            secondTitle={t("dialog.cancel")}
            onSecond={onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={() => onCreate()}>

            <SettingsForm large>

                <SettingsTextField
                    label={t("properties.comment")}
                    value={comment}
                    multiline
                    minRows={2}
                    maxRows={2}
                    onChanged={setComment} />
            </SettingsForm>

        </PopupDialog>
    );
};

export default CreateVersionDialog;
