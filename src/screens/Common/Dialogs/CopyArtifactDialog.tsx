import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { CreateNewFolderOutlined } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { ArtifactApi, RepositoryTO } from "../../../api";
import { FileDescription } from "../../../components/Files/FileListEntry";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsForm from "../../../components/Form/SettingsForm";
import SettingsSelect from "../../../components/Form/SettingsSelect";
import SettingsTextField from "../../../components/Form/SettingsTextField";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { makeSuccessToast } from "../../../util/ToastUtils";

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

interface Props {
    open: boolean;
    onClose: (copied: boolean) => void;
    artifact: FileDescription | undefined;
    repositories: RepositoryTO[];
}

const CopyArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [repositoryId, setRepositoryId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (props.artifact) {
            setTitle(`${props.artifact.name}_copy`);
            setDescription(props.artifact.description || "");
        }
    }, [props.artifact]);

    const onCopy = useCallback(async () => {
        const artifact = props.artifact;

        if (!artifact) {
            return;
        }

        if (!repositoryId) {
            setError(t("validation.noRepository"));
            return;
        }

        if (title.length < 4) {
            setError(t("validation.titleTooShort"));
            return;
        }

        setDisabled(true);
        const response = await apiExec(ArtifactApi, api => api.copyToRepository(repositoryId, artifact.id, {
            description: description,
            name: title,
            fileType: artifact.fileType
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        makeSuccessToast("artifact.copied");
        setDescription("");
        setTitle("");
        setRepositoryId("");
        props.onClose(true);
    }, [props, repositoryId, title, description, t]);

    return (
        <PopupDialog
            small
            disabled={disabled}
            error={error}
            onClose={() => props.onClose(false)}
            icon={<CreateNewFolderOutlined className={classes.icon} />}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.copyTo")}
            firstTitle={t("artifact.copy")}
            onFirst={onCopy}>

            <SettingsForm large>

                <SettingsSelect
                    value={repositoryId}
                    disabled={disabled}
                    label={t("properties.repository")}
                    onChanged={setRepositoryId}>
                    <MenuItem value="">
                        <em>{t("properties.noRepository")}</em>
                    </MenuItem>
                    {props.repositories.map(repo => (
                        <MenuItem
                            key={repo.id}
                            value={repo.id}>
                            {repo.name}
                        </MenuItem>
                    ))}
                </SettingsSelect>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    disabled={disabled}
                    onChanged={setTitle} />

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    minRows={3}
                    maxRows={3}
                    disabled={disabled}
                    onChanged={setDescription} />

            </SettingsForm>
        </PopupDialog>
    );
};
export default CopyArtifactDialog;
