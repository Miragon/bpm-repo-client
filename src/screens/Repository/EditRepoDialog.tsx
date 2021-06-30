import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";
import PopupDialog from "../../components/Form/PopupDialog";
import * as repositoryAction from "../../store/actions/repositoryAction";
import SettingsTextField from "../../components/Form/SettingsTextField";
import { SYNC_STATUS } from "../../store/constants";

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
    const history = useHistory();

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>(props.repoName);
    const [description, setDescription] = useState<string>(props.repoDescription);

    const applyChanges = useCallback(async () => {
        try {
            dispatch(repositoryAction.updateRepository(props.repoId, title, description));
            props.onCancelled();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [title, description, dispatch, props]);

    const deleteRepo = useCallback(() => {
        try {
            if (window.confirm(`Are you sure you want to delete '${title}'?`)) {
                dispatch(repositoryAction.deleteRepository(props.repoId));
                history.push("/");
                dispatch({ type: SYNC_STATUS, dataSynced: false });
                console.log("Sync status = false");
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch, history, props.repoId, title]);

    return (
        <PopupDialog
            open={props.open}
            title={props.repoName}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle="Apply Changes"
            onFirst={applyChanges}
            secondTitle="Close"
            onSecond={props.onCancelled}>
            <div className={classes.deleteSection}>
                <Typography variant="h5">
                    Delete Repository
                </Typography>
                <IconButton className={classes.deleteButton} onClick={deleteRepo}>
                    <DeleteIcon />
                </IconButton>
            </div>

            <div className={classes.spacer} />

            <SettingsTextField
                label="Title"
                value={title}
                onChanged={setTitle} />

            <div className={classes.spacer} />

            <SettingsTextField
                label="Description"
                value={description}
                onChanged={setDescription}
                multiline
                rows={4} />

        </PopupDialog>
    );
};

export default EditRepoDialog;
