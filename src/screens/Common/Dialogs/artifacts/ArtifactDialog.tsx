import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { ArtifactTypeTO, RepositoryTO } from "../../../../api";
import FileIcon from "../../../../components/Files/FileIcon";
import PopupDialog from "../../../../components/Form/PopupDialog";
import SettingsForm from "../../../../components/Form/SettingsForm";
import SettingsSelect from "../../../../components/Form/SettingsSelect";
import SettingsTextField from "../../../../components/Form/SettingsTextField";
import { THEME } from "../../../../theme";
import { CloudUploadOutlined } from "@material-ui/icons";

export interface SimpleArtifact {
    title: string;
    type: string;
    description?: string;
    repositoryId: string;
}

interface Props {
    dialogTitleLabel: string;
    dialogSaveButtonLabel: string;
    action: "create" | "edit" | "copy" | "upload" | "upload-edit";
    artifactTitle?: string;
    artifactDescription?: string;
    artifactType?: string;
    artifactRepository?: string;
    repositories: RepositoryTO[];
    types: ArtifactTypeTO[];
    errorMsg?: string;
    disabled: boolean;
    open: boolean;
    onSave: (artifact: SimpleArtifact) => void;
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

const ArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const {
        artifactTitle,
        artifactDescription,
        artifactType,
        artifactRepository,
        repositories,
        types,
        open,
        errorMsg,
        disabled,
        onClose
    } = props;

    const [error, setError] = useState<string | undefined>(errorMsg);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [repository, setRepository] = useState("");

    // somehow react is not initializing correctly
    useEffect(() => {
        if (artifactType) {
            setType(artifactType);
        }
        if (artifactRepository) {
            setRepository(artifactRepository);
        }
        if (artifactTitle) {
            setTitle(artifactTitle);
        }
        if (artifactDescription) {
            setDescription(artifactDescription);
        }
    }, [artifactDescription, artifactRepository, artifactTitle, artifactType, setType])

    const onSave = useCallback(async () => {
        if (title.length < 4) {
            setError(t("validation.titleTooShort"));
            return;
        }

        if (!repository) {
            setError(t("validation.noRepository"));
            return;
        }

        setError(undefined);
        props.onSave({
            title: title,
            description: description,
            type: type,
            repositoryId: repository
        });

        // reset values
        setTitle("");
        setDescription("");
        setType("");
        setRepository("");
    }, [title, repository, props, description, type, t]);

    const onCancel = useCallback(() => {
        onClose(null);
    }, [onClose]);

    const icon = props.action === "upload" ?
        <CloudUploadOutlined className={classes.titleIcon} /> :
        <FileIcon
            color="white"
            className={classes.titleIcon}
            iconColor={THEME.content.primary}
            type={type} />;

    return (
        <PopupDialog
            small
            onClose={onCancel}
            icon={icon}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            disabled={disabled}
            title={props.dialogTitleLabel}
            firstTitle={props.dialogSaveButtonLabel}
            onFirst={onSave}>

            <SettingsForm>

                {props.children}

                {!(props.action === "edit" || props.action === "upload-edit") &&
                    <SettingsSelect
                        disabled={disabled}
                        value={repository}
                        label={t("properties.repository")}
                        onChanged={setRepository}>
                        <MenuItem value=""><em>{t("properties.noRepository")}</em></MenuItem>
                        {repositories.map(repo => (
                            <MenuItem
                                key={repo.id}
                                value={repo.id}
                                selected={repo.id === repository}>
                                {repo.name}
                            </MenuItem>
                        ))}
                    </SettingsSelect>
                }

                <SettingsSelect
                    disabled={props.action === "edit" || props.action === "copy" || props.action === "upload-edit" || disabled}
                    value={type}
                    label={t("properties.type")}
                    onChanged={setType}>
                    <MenuItem value=""><em>{t("properties.noType")}</em></MenuItem>
                    {(props.action === "edit" || props.action === "copy" || props.action === "upload-edit") &&
                        <MenuItem value={type}><em>{type}</em></MenuItem>
                    }
                    {types.map(ty => (
                        <MenuItem
                            key={ty.name}
                            value={ty.name}
                            selected={ty.name === type}>
                            {ty.name}
                        </MenuItem>
                    ))}
                </SettingsSelect>

                <SettingsTextField
                    disabled={disabled}
                    label={t("properties.title")}
                    value={title}
                    onChanged={setTitle} />

                <SettingsTextField
                    disabled={disabled}
                    label={t("properties.description")}
                    value={description}
                    multiline
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription} />

            </SettingsForm>

        </PopupDialog>
    );
};

export default ArtifactDialog;
