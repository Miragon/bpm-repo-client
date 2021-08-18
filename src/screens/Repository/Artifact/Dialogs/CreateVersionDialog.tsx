import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/styles";
import {useTranslation} from "react-i18next";
import {ArtifactVersionTO, ArtifactVersionUploadTOSaveTypeEnum} from "../../../../api";
import {RootState} from "../../../../store/reducers/rootReducer";
import {createOrUpdateVersion, getAllVersions} from "../../../../store/actions";
import PopupDialog from "../../../../components/Form/PopupDialog";
import {HANDLEDERROR} from "../../../../constants/Constants";
import SettingsForm from "../../../../components/Form/SettingsForm";
import SettingsTextField from "../../../../components/Form/SettingsTextField";

const useStyles = makeStyles(() => ({
    container: {}
}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    onCreated: () => void;
    artifactId: string;
    artifactTitle: string;
}

const CreateVersionDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");

    const latestVersion: ArtifactVersionTO | null = useSelector((state: RootState) => state.versions.latestVersion);

    const {
        open, onCancelled, artifactId, artifactTitle
    } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [comment, setComment] = useState("");



    //#TODO: Versionen Updaten über SyncState ausführen,  nicht direkt callen
    const onCreate = useCallback(async () => {
        try {
            if(latestVersion){
                await dispatch(createOrUpdateVersion(artifactId, latestVersion?.xml, ArtifactVersionUploadTOSaveTypeEnum.Milestone, comment));
                dispatch(getAllVersions(artifactId));
                onCancelled();
            } else {
                dispatch({type: HANDLEDERROR, errorMessage: "Can't load XML of the latest version"})
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [artifactId, comment, dispatch, onCancelled, latestVersion]);



    return (
        <PopupDialog
            className={classes.container}
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("version.dialogHeader", {artifactName: artifactTitle})}
            secondTitle={t("dialog.cancel")}
            onSecond={onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={() => onCreate()}>

            <SettingsForm large>

                <SettingsTextField
                    label={t("properties.comment")}
                    value={comment}
                    multiline
                    rows={2}
                    rowsMax={2}
                    onChanged={setComment} />
            </SettingsForm>

        </PopupDialog>
    );
};

export default CreateVersionDialog;
