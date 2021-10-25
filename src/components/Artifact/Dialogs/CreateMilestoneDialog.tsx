import {makeStyles} from "@material-ui/styles";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {ArtifactTO} from "../../../api";
import {
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_MILESTONE,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY
} from "../../../constants/Constants";
import helpers from "../../../util/helperFunctions";
import PopupDialog from "../../Shared/Form/PopupDialog";
import SettingsForm from "../../Shared/Form/SettingsForm";
import SettingsTextField from "../../Shared/Form/SettingsTextField";
import {createMilestone, getLatestMilestone} from "../../../store/actions";

const useStyles = makeStyles(() => ({
    container: {}
}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    onCreated: () => void;
    artifact: ArtifactTO | undefined;
}

const CreateMilestoneDialog: React.FC<Props> = props => {
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

        getLatestMilestone(artifact.id).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                createMilestone(artifact.id, response.data.file, comment).then(response2 => {
                    if (Math.floor(response2.status / 100) === 2) {
                        dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                        dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                        dispatch({ type: SYNC_STATUS_RECENT, dataSynced: false })
                        dispatch({ type: SYNC_STATUS_MILESTONE, dataSynced: false });
                        helpers.makeSuccessToast(t("milestone.created"));
                        onCancelled()
                    } else {
                        helpers.makeErrorToast(response2.data.toString(), () => getLatestMilestone(artifact.id))
                    }
                }, error => {
                    helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => getLatestMilestone(artifact.id))

                })
            } else {
                helpers.makeErrorToast(response.data.toString(), () => getLatestMilestone(artifact.id))
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => getLatestMilestone(artifact.id))
        })

    }, [artifact, comment, dispatch, onCancelled, t])

    return (
        <PopupDialog
            className={classes.container}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("milestone.dialogHeader", { artifactName: artifact?.name })}
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

export default CreateMilestoneDialog;
