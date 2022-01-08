import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteOutlineOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RepositoryApi, RepositoryTO } from "../../../api";
import PopupDialog from "../../../components/Form/PopupDialog";
import { updateRepositories } from "../../../store/RepositoryState";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { makeSuccessToast } from "../../../util/ToastUtils";

interface Props {
    open: boolean;
    repository: RepositoryTO | undefined;
    onClose: (deleted: boolean) => void;
}

const useStyles = makeStyles({
    titleIcon: {
        fontSize: "3rem",
        color: "white"
    }
});

const DeleteRepositoryDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const { repository, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();

    const onDelete = useCallback(async () => {
        if (!repository) {
            setError("Kein Projekt ausgewählt!");
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(RepositoryApi, api => api.deleteRepository(repository.id));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        dispatch(updateRepositories({
            key: "id",
            delete: [repository.id]
        }));
        makeSuccessToast(t("repository.deleted"));
        onClose(true);
    }, [repository, dispatch, onClose, t]);

    const onCancel = useCallback(() => {
        onClose(false);
    }, [onClose]);

    return (
        <PopupDialog
            small
            danger
            onClose={onCancel}
            icon={<DeleteOutlineOutlined className={classes.titleIcon} />}
            disabled={disabled}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("repository.delete")}
            firstTitle={t("repository.delete")}
            onFirst={onDelete}>

            <Typography variant="body1">
                {t("repository.confirmDelete", { repositoryName: repository?.name })}
            </Typography>

        </PopupDialog>
    );
};

export default DeleteRepositoryDialog;
