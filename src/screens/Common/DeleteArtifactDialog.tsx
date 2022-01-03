import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteForeverOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactApi } from "../../api";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import PopupDialog from "../../components/Shared/Form/PopupDialog";
import { apiExec, hasFailed } from "../../util/ApiUtils";
import helpers from "../../util/helperFunctions";

interface Props {
    artifact: FileDescription | undefined;
    open: boolean;
    onClose: (deleted: boolean) => void;
}

const useStyles = makeStyles({
    titleIcon: {
        fontSize: "3rem",
        color: "white"
    }
});

const DeleteArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { artifact, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();

    const onDelete = useCallback(async () => {
        if (!artifact) {
            setError("Keine Datei ausgewählt!");
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(ArtifactApi, api => api.deleteArtifact(artifact.id));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        helpers.makeSuccessToast(t("artifact.deleted"));
        onClose(true);
    }, [artifact, onClose, t]);

    const onCancel = useCallback(() => {
        onClose(false);
    }, [onClose]);

    return (
        <PopupDialog
            small
            danger
            onClose={onCancel}
            icon={<DeleteForeverOutlined className={classes.titleIcon} />}
            disabled={disabled}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("artifact.delete")}
            firstTitle={t("artifact.delete")}
            onFirst={onDelete}>

            <Typography variant="body1">
                {t("artifact.confirmDelete", { artifactName: artifact?.name })}
            </Typography>

        </PopupDialog>
    );
};

export default DeleteArtifactDialog;
