import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {ArtifactVersionUploadTOSaveTypeEnum} from "../../../../api";
import {createArtifact, createVersion} from "../../../../store/actions";
import PopupDialog from "../../../../components/Form/PopupDialog";
import SettingsForm from "../../../../components/Form/SettingsForm";
import SettingsTextField from "../../../../components/Form/SettingsTextField";
import {
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_RECENT,
    SYNC_STATUS_REPOSITORY,
    SYNC_STATUS_VERSION
} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: string;
    repoId: string;
    versionNo: number;
    file: string;
    artifactId: string;
}

const SaveAsNewArtifactDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const onCreate = useCallback(async () => {
        createArtifact(props.repoId, title, description, props.type).then(response => {
            if(Math.floor(response.status / 100) === 2){
                createVersion(response.data.id, props.file, ArtifactVersionUploadTOSaveTypeEnum.Milestone).then(response => {
                    if(Math.floor(response.status / 100) === 2){
                        dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                        dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                        dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                        dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                    } else {
                        helpers.makeErrorToast(t(response.data.toString()), () => createVersion(response.data.id, props.file, ArtifactVersionUploadTOSaveTypeEnum.Milestone))
                    }
                }, error => {
                    helpers.makeErrorToast(t(error.response.data), () => createVersion(response.data.id, props.file, ArtifactVersionUploadTOSaveTypeEnum.Milestone))
                })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => onCreate())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => onCreate())
        })

    }, [props.repoId, props.type, props.file, title, description, dispatch, t]);


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("version.saveVersionXAsNewArtifact", {milestone: props.versionNo})}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={onCreate} >

            <SettingsForm large>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    onChanged={setTitle}/>

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    rows={3}
                    rowsMax={3}
                    onChanged={setDescription}/>

            </SettingsForm>
        </PopupDialog>
    );
};
export default SaveAsNewArtifactDialog;
