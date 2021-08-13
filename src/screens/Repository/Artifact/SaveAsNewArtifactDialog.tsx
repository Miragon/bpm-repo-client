import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsForm from "../../../components/Form/SettingsForm";
import SettingsTextField from "../../../components/Form/SettingsTextField";
import {ArtifactTypeTO} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import {createNewArtifactWithVersionFile} from "../../../store/actions";

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


    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes)

    const onCreate = useCallback(async () => {
        try {

            const defaultFileProps = fileTypes.find(fileType => fileType.name === props.type)

            if(defaultFileProps){
                //#TODO: The default Preview SVG will always be passed here => passt aber auch, für einzelne Versionen gibt es keine SVG Previews (immer nur für die aktuellste, gespeichert in ArtifactEntity/ ArtifactEntity)
                dispatch(createNewArtifactWithVersionFile(props.repoId, title, description, props.file, defaultFileProps.name, "defaultFileProps.defaultPreviewSVG"));
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
