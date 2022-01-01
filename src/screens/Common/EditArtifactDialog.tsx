import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactApi } from "../../api";
import FileIcon from "../../components/Layout/Files/FileIcon";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import PopupDialog from "../../components/Shared/Form/PopupDialog";
import SettingsForm from "../../components/Shared/Form/SettingsForm";
import SettingsTextField from "../../components/Shared/Form/SettingsTextField";
import { THEME } from "../../theme";
import { apiExec, hasFailed } from "../../util/ApiUtils";
import helpers from "../../util/helperFunctions";

interface Props {
    artifact: FileDescription | undefined;
    open: boolean;
    onClose: (saved: boolean) => void;
}

const useStyles = makeStyles({
    titleIcon: {
        fontSize: "3rem"
    }
});

const EditArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { artifact, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (artifact) {
            setTitle(artifact.name);
            setDescription(artifact.description);
        }
    }, [artifact]);

    const onEdit = useCallback(async () => {
        if (title.length < 4) {
            setError("Der Titel ist zu kurz!");
            return;
        }

        if (!artifact) {
            setError("Keine Datei ausgewählt!");
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(ArtifactApi, api => api.updateArtifact(artifact.id, {
            description: description,
            name: title
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            if (response.error) {
                setError(t(response.error));
            } else {
                setError(response.error);
            }
            return;
        }

        helpers.makeSuccessToast(t("artifact.changed"));
        onClose(true);
        setTitle("");
        setDescription("");
    }, [artifact, title, description, onClose, t]);

    const onCancel = useCallback(() => {
        onClose(false);
    }, [onClose]);

    return (
        <PopupDialog
            small
            onClose={onCancel}
            icon={(
                <FileIcon
                    color="white"
                    className={classes.titleIcon}
                    iconColor={THEME.content.primary}
                    type={artifact?.fileType} />
            )}
            disabled={disabled}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("artifact.edit")}
            firstTitle={t("dialog.applyChanges")}
            onFirst={onEdit}>

            <SettingsForm>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    disabled={disabled}
                    onChanged={setTitle} />

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    disabled={disabled}
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription} />

            </SettingsForm>

        </PopupDialog>
    );
};

export default EditArtifactDialog;
