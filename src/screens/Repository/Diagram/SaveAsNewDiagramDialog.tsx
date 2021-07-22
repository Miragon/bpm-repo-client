import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import * as diagramAction from "../../../store/actions/diagramAction";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsForm from "../../../components/Form/SettingsForm";
import SettingsTextField from "../../../components/Form/SettingsTextField";
import {FileTypesTO} from "../../../api/models";
import {RootState} from "../../../store/reducers/rootReducer";

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


    const fileTypes: Array<FileTypesTO> = useSelector((state: RootState) => state.diagrams.fileTypes)

    const onCreate = useCallback(async () => {
        try {
            const defaultFileProps = fileTypes.find(fileType => fileType.name === props.type)
            if(defaultFileProps){
                //#TODO: The default Preview SVG will always be passed here => passt aber auch, für einzelne Versionen gibt es keine SVG Previews (immer nur für die aktuellste, gespeichert in DiagramEntity/ ArtifactEntity)
                dispatch(diagramAction.createNewDiagramWithVersionFile(props.repoId, title, description, props.file, defaultFileProps.name, defaultFileProps.defaultPreviewSVG));
                props.onCancelled();
            }

        } catch (err) {
            console.log(err);
        }
    }, [dispatch, title, description, props, fileTypes]);


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
