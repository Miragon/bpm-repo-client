import { makeStyles } from "@material-ui/core/styles";
import { SettingsOutlined } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RepositoryApi, RepositoryTO } from "../../../api";
import PopupDialog from "../../../components/Shared/Form/PopupDialog";
import SettingsForm from "../../../components/Shared/Form/SettingsForm";
import SettingsTextField from "../../../components/Shared/Form/SettingsTextField";
import { updateRepositories } from "../../../store/RepositoryState";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import helpers from "../../../util/helperFunctions";

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

interface Props {
    open: boolean;
    repository: RepositoryTO | undefined;
    onClose: (saved: boolean) => void;
}

const EditRepositoryDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const { repository, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (repository) {
            setTitle(repository.name);
            setDescription(repository.description);
        }
    }, [repository]);

    const onSave = useCallback(async () => {
        if (!repository) {
            return;
        }

        if (title.length < 4) {
            setError("Der Titel ist zu kurz!");
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(RepositoryApi, api => api.updateRepository(repository.id, {
            description: description,
            name: title
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        helpers.makeSuccessToast(t("repository.updated"));
        dispatch(updateRepositories({
            key: "id",
            update: [response.result]
        }));
        onClose(true);
    }, [repository, title, description, onClose, dispatch, t]);

    const onCancel = useCallback(() => {
        onClose(false);
    }, [onClose]);

    return (
        <PopupDialog
            small
            disabled={disabled}
            error={error}
            icon={<SettingsOutlined className={classes.icon} />}
            onClose={onCancel}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("repository.settings")}
            firstTitle={t("dialog.applyChanges")}
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

export default EditRepositoryDialog;
