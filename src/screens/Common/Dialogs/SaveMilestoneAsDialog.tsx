import { makeStyles } from "@material-ui/core/styles";
import { SaveOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactApi, ArtifactMilestoneTO, MilestoneApi } from "../../../api";
import PopupDialog from "../../../components/Shared/Form/PopupDialog";
import SettingsForm from "../../../components/Shared/Form/SettingsForm";
import SettingsTextField from "../../../components/Shared/Form/SettingsTextField";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import helpers from "../../../util/helperFunctions";

interface Props {
    open: boolean;
    fileType: string | undefined;
    onClose: (saved: boolean) => void;
    milestone: ArtifactMilestoneTO | undefined;
}

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

const SaveMilestoneAsDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { open, milestone, fileType, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const onSave = useCallback(async () => {
        if (!milestone || !fileType) {
            return;
        }

        if (title.length < 4) {
            setError("Titel ist zu kurz!");
            return;
        }

        setError(undefined);
        setDisabled(true);

        const artifactResponse = await apiExec(ArtifactApi, api => api.createArtifact(milestone.repositoryId, {
            name: title,
            description: description,
            fileType: fileType
        }));
        if (hasFailed(artifactResponse)) {
            setError(t(artifactResponse.error));
            setDisabled(false);
            return;
        }

        const milestoneResponse = await apiExec(MilestoneApi, api => api.createMilestone(artifactResponse.result.id, {
            file: milestone.file,
            comment: ""
        }));
        setDisabled(false);
        if (hasFailed(milestoneResponse)) {
            setError(t(milestoneResponse.error));
            return;
        }

        helpers.makeSuccessToast(t("milestone.savedAsArtifact"));
        setTitle("");
        setDescription("");
        onClose(true);
    }, [milestone, fileType, title, description, t, onClose]);

    return (
        <PopupDialog
            small
            open={open}
            error={error}
            disabled={disabled}
            icon={<SaveOutlined className={classes.icon} />}
            onClose={() => onClose(false)}
            onCloseError={() => setError(undefined)}
            title={t("milestone.saveAsNewArtifact")}
            firstTitle={t("dialog.create")}
            onFirst={onSave}>

            <SettingsForm large>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    disabled={disabled}
                    onChanged={setTitle} />

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    disabled={disabled}
                    multiline
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription} />

            </SettingsForm>

        </PopupDialog>
    );
};

export default SaveMilestoneAsDialog;
