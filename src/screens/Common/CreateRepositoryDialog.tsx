import { makeStyles } from "@material-ui/core/styles";
import { CreateNewFolderOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RepositoryApi } from "../../api";
import PopupDialog from "../../components/Shared/Form/PopupDialog";
import SettingsForm from "../../components/Shared/Form/SettingsForm";
import SettingsTextField from "../../components/Shared/Form/SettingsTextField";
import { updateRepositories } from "../../store/RepositoryState";
import { apiExec, hasFailed } from "../../util/ApiUtils";
import helpers from "../../util/helperFunctions";

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

interface Props {
    open: boolean;
    onClose: (repositoryId: string | null) => void;
}

const CreateRepositoryDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const { open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const onCreate = useCallback(async () => {
        if (title.length < 4) {
            setError("Der Titel ist zu kurz!");
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(RepositoryApi, api => api.createRepository({
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

        helpers.makeSuccessToast(t("repository.created"));
        dispatch(updateRepositories({
            key: "id",
            update: [response.result]
        }));
        onClose(response.result.id);
        setTitle("");
        setDescription("");
    }, [title, description, onClose, dispatch, t]);

    const onCancel = useCallback(() => {
        onClose(null);
    }, [onClose]);

    return (
        <PopupDialog
            small
            disabled={disabled}
            error={error}
            icon={<CreateNewFolderOutlined className={classes.icon} />}
            onClose={onCancel}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("repository.create")}
            firstTitle={t("dialog.create")}
            onFirst={onCreate}>

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

export default CreateRepositoryDialog;
