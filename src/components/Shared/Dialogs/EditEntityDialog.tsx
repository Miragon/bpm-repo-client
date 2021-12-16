import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import { AxiosResponse } from "axios";
import { useHistory } from "react-router-dom";
import {
    SYNC_STATUS_ACTIVE_ENTITY,
    SYNC_STATUS_FAVORITE,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY
} from "../../../constants/Constants";
import PopupDialog from "../Form/PopupDialog";
import SettingsTextField from "../Form/SettingsTextField";
import { makeErrorToast, makeSuccessToast } from "../../../util/toastUtils";

/**
 Component shows a Popup Menu which lets the user change properties of a Repository or Team or delete it, depending from which screen this dialog is opened
 * */

const useStyles = makeStyles(() => ({
    line: {
        display: "flex",
        flexDirection: "column"
    },
    property: {
        flexBasis: "20px"
    },
    spacer: {
        marginTop: "15px"
    },
    deleteSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    deleteButton: {
        border: "1px solid lightgrey",
        backgroundColor: "white",
        color: "red",
        transition: "background-color .3s",
        borderRadius: "4px",
        width: "150px",
        "&:hover": {
            backgroundColor: "red",
            color: "white"
        }
    },

}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    targetId: string;
    repoName: string;
    repoDescription: string;
    updateEntityMethod: (targetId: string, target: string, description: string) => Promise<AxiosResponse>;
    deleteEntityMethod: (targetId: string) => Promise<AxiosResponse>;
}

const EditEntityDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>(props.repoName);
    const [description, setDescription] = useState<string>(props.repoDescription);

    const applyChanges = useCallback(async () => {
        props.updateEntityMethod(props.targetId, title, description).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                makeSuccessToast(t("repository.updated"));
                dispatch({ type: SYNC_STATUS_ACTIVE_ENTITY, dataSynced: false });
                props.onCancelled();
            } else {
                makeErrorToast(t(response.data.toString()), () => applyChanges());
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => applyChanges());
        });
    }, [props, title, description, t, dispatch]);

    const deleteRepo = useCallback(() => {
        if (window.confirm(t("repository.confirmDelete", { repoName: title }))) {
            props.deleteEntityMethod(props.targetId).then(response => {
                if (Math.floor(response.status / 100) === 2) {
                    dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                    dispatch({ type: SYNC_STATUS_RECENT, dataSynced: false });
                    dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: false });
                    makeSuccessToast(t("repository.deleted"));
                    history.push("/");
                } else {
                    makeErrorToast(t("repository.couldNotDelete"), () => deleteRepo());
                }
            }, error => {
                makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => deleteRepo());
            });
        }
    }, [t, title, props, dispatch, history]);

    return (
        <PopupDialog
            open={props.open}
            title={props.repoName}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("dialog.applyChanges")}
            onFirst={applyChanges}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}>
            <div className={classes.deleteSection}>
                <Typography variant="h5">
                    {t("repository.delete")}
                </Typography>
                <IconButton className={classes.deleteButton} onClick={deleteRepo}>
                    <DeleteIcon />
                </IconButton>
            </div>

            <div className={classes.spacer} />

            <SettingsTextField
                label={t("properties.title")}
                value={title}
                onChanged={setTitle} />

            <div className={classes.spacer} />

            <SettingsTextField
                label={t("properties.description")}
                value={description}
                onChanged={setDescription}
                multiline
                minRows={4} />

        </PopupDialog>
    );
};

export default EditEntityDialog;
