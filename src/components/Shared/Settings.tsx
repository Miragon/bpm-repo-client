import {makeStyles} from "@material-ui/core/styles";
import {AxiosResponse} from "axios";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useCallback, useState} from "react";
import helpers from "../../util/helperFunctions";
import {
    SYNC_STATUS_ACTIVE_ENTITY,
    SYNC_STATUS_FAVORITE,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY
} from "../../constants/Constants";
import {IconButton, Typography} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsTextField from "./Form/SettingsTextField";
import SimpleButton from "./Form/SimpleButton";


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
    targetId: string;
    entityName: string;
    entityDescription: string;
    updateEntityMethod: (targetId: string, target: string, description: string) => Promise<AxiosResponse>;
    deleteEntityMethod: (targetId: string) => Promise<AxiosResponse>;
}


const Settings: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const {t} = useTranslation("common");

    const [title, setTitle] = useState<string>(props.entityName);
    const [description, setDescription] = useState<string>(props.entityDescription);

    const applyChanges = useCallback(async () => {
        props.updateEntityMethod(props.targetId, title, description).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                helpers.makeSuccessToast(t("repository.updated"))
                dispatch({type: SYNC_STATUS_ACTIVE_ENTITY, dataSynced: false});
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => applyChanges())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => applyChanges())
        })
    }, [props, title, description, t, dispatch]);

    const deleteEntity = useCallback(() => {
        if (window.confirm(t("repository.confirmDelete", {repoName: title}))) {
            props.deleteEntityMethod(props.targetId).then(response => {
                if(Math.floor(response.status / 100) === 2) {
                    dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: false });
                    dispatch({type: SYNC_STATUS_RECENT, dataSynced: false});
                    dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: false});
                    helpers.makeSuccessToast(t("repository.deleted"))
                    history.push("/repository")
                } else {
                    helpers.makeErrorToast(t("repository.couldNotDelete"), () => deleteEntity())
                }
            }, error => {
                helpers.makeErrorToast(t(error.response.data), () => deleteEntity())
            })
        }
    }, [t, title, props, dispatch, history]);



    return (
        <>


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

            <div className={classes.spacer} />

            <div className={classes.deleteSection}>
                <Typography variant="h5">
                    {t("repository.delete")}
                </Typography>
                <IconButton className={classes.deleteButton} onClick={deleteEntity}>
                    <DeleteIcon />
                </IconButton>
            </div>

            <div  className={classes.spacer} />
            <div  className={classes.spacer} />

            <div>
                <SimpleButton title={"Apply"} onClick={applyChanges} fullWidth={true}/>
            </div>


        </>
    )
}

export default Settings;