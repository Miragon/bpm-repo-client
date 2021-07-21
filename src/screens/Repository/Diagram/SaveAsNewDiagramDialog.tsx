import {DiagramTO, DiagramVersionUploadTOSaveTypeEnum, RepositoryTO} from "../../../api/models";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {RootState} from "../../../store/reducers/rootReducer";
import * as diagramAction from "../../../store/actions/diagramAction";
import * as versionAction from "../../../store/actions/versionAction";
import {CREATE_VERSION_WITH_FILE, DEFAULT_DMN_FILE, DEFAULT_XML_FILE} from "../../../store/constants";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsForm from "../../../components/Form/SettingsForm";
import SettingsSelect from "../../../components/Form/SettingsSelect";
import MenuItem from "@material-ui/core/MenuItem";
import SettingsTextField from "../../../components/Form/SettingsTextField";
import {createDiagram} from "../../../store/actions/diagramAction";
import {DiagramVersionTO} from "../../../models";
import {createOrUpdateVersion} from "../../../store/actions/versionAction";

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: "bpmn" | "dmn";
    repoId: string;
    versionNo: string;
    file: string;
    diagramId: string;
}

const SaveAsNewDiagramDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [toBeCreatedState, setToBeCreatedState] = useState("");
    const versionToBeCreated: DiagramVersionTO = useSelector((state: RootState) => state.versions.versionProps)

    const onCreate = useCallback(async () => {
        try {
            dispatch(diagramAction.createNewDiagramWithVersionFile(props.repoId, title, description, props.file, props.type));
            props.onCancelled();
        } catch (err) {
            console.log(err);
        }
    }, [dispatch, title, description, props]);

    useEffect(() => {
        //#TODO: Wird wiederholt aufgerufen
        if(versionToBeCreated && versionToBeCreated?.repositoryId !== toBeCreatedState){
            dispatch(createOrUpdateVersion(versionToBeCreated.diagramId, versionToBeCreated.xml, DiagramVersionUploadTOSaveTypeEnum.MILESTONE))
            setToBeCreatedState(versionToBeCreated.repositoryId)
        }
    }, [dispatch, versionToBeCreated, toBeCreatedState])


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("version.saveVersionXAsNewDiagram", {milestone: props.versionNo})}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={onCreate}
            firstDisabled={title === ""} >

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
export default SaveAsNewDiagramDialog;
