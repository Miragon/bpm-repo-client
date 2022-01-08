import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { ArtifactApi, RepositoryTO } from "../../../api";
import FileIcon from "../../../components/Files/FileIcon";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsForm from "../../../components/Form/SettingsForm";
import SettingsSelect from "../../../components/Form/SettingsSelect";
import SettingsTextField from "../../../components/Form/SettingsTextField";
import { THEME } from "../../../theme";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { makeSuccessToast } from "../../../util/ToastUtils";

interface Props {
    type: string;
    repositories: RepositoryTO[];
    repositoryId?: string;
    open: boolean;
    onClose: (artifact: {
        repositoryId: string;
        artifactId: string;
    } | null) => void;
}

const useStyles = makeStyles({
    titleIcon: {
        fontSize: "3rem"
    }
});

const CreateArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { repositoryId, repositories, type, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState("");

    useEffect(() => {
        if (repositoryId) {
            setRepository(repositoryId);
        }
    }, [repositoryId]);

    const onCreate = useCallback(async () => {
        if (title.length < 4) {
            setError("Der Titel ist zu kurz!");
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(ArtifactApi, api => api.createArtifact(repository, {
            fileType: type,
            description: description,
            name: title
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        makeSuccessToast(t("artifact.created"));
        onClose({
            repositoryId: response.result.repositoryId,
            artifactId: response.result.id
        });
        setTitle("");
        setDescription("");
        setRepository("");
    }, [repository, type, title, description, onClose, t]);

    const onCancel = useCallback(() => {
        onClose(null);
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
                    type={type} />
            )}
            disabled={disabled}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t(`artifact.create${type}`)}
            firstTitle={t("dialog.create")}
            onFirst={onCreate}>

            <SettingsForm>

                <SettingsSelect
                    disabled={disabled}
                    value={repository}
                    label={t("repository.target")}
                    onChanged={setRepository}>
                    <MenuItem value=""><em>{t("properties.notSelected")}</em></MenuItem>
                    {repositories.map(repo => (
                        <MenuItem
                            key={repo.id}
                            value={repo.id}
                            selected={repo.id === repository}>
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
                    disabled={disabled}
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription} />

            </SettingsForm>

        </PopupDialog>
    );
};

export default CreateArtifactDialog;
