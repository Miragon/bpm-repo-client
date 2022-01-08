import { SaveOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { MilestoneApi } from "../../../api";
import { FileDescription } from "../../../components/Files/FileListEntry";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsTextField from "../../../components/Form/SettingsTextField";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { makeSuccessToast } from "../../../util/ToastUtils";

const useStyles = makeStyles(() => ({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
}));

interface Props {
    open: boolean;
    artifact: FileDescription | undefined;
    onClose: (created: boolean) => void;
}

const CreateMilestoneDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const {
        open, onClose, artifact
    } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [comment, setComment] = useState("");

    const onCreate = useCallback(async () => {
        if (!artifact) {
            return;
        }

        if (comment.length < 4) {
            setError("Kommentar zu kurz!");
            return;
        }

        setError(undefined);
        setDisabled(true);

        const latestMilestoneResponse = await apiExec(MilestoneApi, api => api.getLatestMilestone(artifact.id));
        if (hasFailed(latestMilestoneResponse)) {
            setError(t(latestMilestoneResponse.error));
            setDisabled(false);
            return;
        }

        const createMilestoneResponse = await apiExec(MilestoneApi, api => api.createMilestone(artifact.id, {
            file: latestMilestoneResponse.result.file,
            comment: comment
        }));
        setDisabled(false);
        if (hasFailed(createMilestoneResponse)) {
            setError(t(createMilestoneResponse.error));
            return;
        }

        makeSuccessToast(t("milestone.created"));
        setComment("");
        onClose(true);
    }, [artifact, comment, onClose, t])

    return (
        <PopupDialog
            small
            disabled={disabled}
            error={error}
            onCloseError={() => setError(undefined)}
            icon={<SaveOutlined className={classes.icon} />}
            onClose={() => onClose(false)}
            open={open}
            title={t("milestone.create")}
            firstTitle={t("dialog.create")}
            onFirst={() => onCreate()}>

            <SettingsTextField
                label={t("properties.comment")}
                disabled={disabled}
                value={comment}
                multiline
                minRows={3}
                maxRows={3}
                onChanged={setComment} />

        </PopupDialog>
    );
};

export default CreateMilestoneDialog;
