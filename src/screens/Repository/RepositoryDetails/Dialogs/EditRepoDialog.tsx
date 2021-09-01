import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {IconButton, Typography} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {useTranslation} from "react-i18next";
import SettingsTextField from "../../../../components/Form/SettingsTextField";
import PopupDialog from "../../../../components/Form/PopupDialog";
import {deleteRepository, updateRepository} from "../../../../store/actions";
import {
    SYNC_STATUS_ACTIVE_REPOSITORY,
    SYNC_STATUS_FAVORITE,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY
} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";

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
    repoId: string;
    repoName: string;
    repoDescription: string;
}

const EditRepoDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>(props.repoName);
    const [description, setDescription] = useState<string>(props.repoDescription);

    const applyChanges = useCallback(async () => {
        updateRepository(props.repoId, title, description).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                helpers.makeSuccessToast(t("repository.updated"))
                dispatch({type: SYNC_STATUS_ACTIVE_REPOSITORY, dataSynced: false});
                props.onCancelled()
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => applyChanges())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => applyChanges())
        })
    }, [props, title, description, t, dispatch]);

    const deleteRepo = useCallback(() => {
        if (window.confirm(t("repository.confirmDelete", {repoName: title}))) {
            deleteRepository(props.repoId).then(response => {
                if(Math.floor(response.status / 100) === 2) {
                    dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                    dispatch({type: SYNC_STATUS_RECENT, dataSynced: false});
                    dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: false});
                    helpers.makeSuccessToast(t("repository.deleted"))
                } else {
                    helpers.makeErrorToast(t("repository.couldNotDelete"), () => deleteRepo())
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => deleteRepo())
            })
        }
    }, [dispatch, props.repoId, title, t]);

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
                rows={4} />

        </PopupDialog>
    );
};

export default EditRepoDialog;
