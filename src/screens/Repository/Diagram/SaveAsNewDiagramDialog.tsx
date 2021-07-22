import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import * as diagramAction from "../../../store/actions/diagramAction";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsForm from "../../../components/Form/SettingsForm";
import SettingsTextField from "../../../components/Form/SettingsTextField";

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



    const onCreate = useCallback(async () => {
        try {
            dispatch(diagramAction.createNewDiagramWithVersionFile(props.repoId, title, description, props.file, props.type));
            props.onCancelled();
        } catch (err) {
            console.log(err);
        }
    }, [dispatch, title, description, props]);


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
