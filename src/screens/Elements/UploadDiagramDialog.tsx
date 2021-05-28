import {makeStyles} from "@material-ui/core/styles";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {BpmnDiagramTO, BpmnRepositoryRequestTO} from "../../api/models";
import {useDispatch, useSelector} from "react-redux";
import {toast, ToastContainer} from "react-toastify";
import * as diagramAction from "../../store/actions/diagramAction";
import * as versionAction from "../../store/actions/versionAction";
import MenuItem from "@material-ui/core/MenuItem";
import {RootState} from "../../store/reducers/rootReducer";
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(() => ({
    input: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        marginBottom: "12px"
    }
}));

interface Props {
    open: boolean;
    onCancelled: () => void;
}

const UploadDiagramDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        open, onCancelled
    } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState("");
    const [file, setFile] = useState<string>("");

    const allRepos: Array<BpmnRepositoryRequestTO> = useSelector((state: RootState) => state.repos.repos)
    const uploadedDiagram: BpmnDiagramTO = useSelector((state: RootState) => state.uploadedDiagram.uploadedDiagram)


    useEffect(() => {
        if(uploadedDiagram != undefined){
            dispatch(versionAction.createOrUpdateVersion(uploadedDiagram.bpmnRepositoryId, uploadedDiagram.bpmnDiagramId, file))
        }
    }, [dispatch, uploadedDiagram])


    const onCreate = useCallback(async () => {
        try{
            dispatch(diagramAction.uploadDiagram(repository, title, description))
        } catch (err) {
            toast.error(err);
        }
    }, [title, description, repository, dispatch]);



    const onFileChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { target: { files } } = e;
        if (files != null && files.length > 0) {
            const file = files[0];
            const fileExtension = file.name.substring(file.name.lastIndexOf("."), file.name.length)
            if(fileExtension != ".bpmn"){
                toast.error("File must be of type .bpmn")
            }
            const reader = new FileReader();
            reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
                if (typeof event.target?.result === "string") {
                    setFile(event.target?.result);
                }
            });
            reader.readAsText(file);
        }
    }, []);

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title="Upload Diagram File"
            secondTitle="Cancel"
            onSecond={onCancelled}
            firstTitle="Create"
            onFirst={onCreate}>

            <SettingsForm large>

                <input
                    className={classes.input}
                    accept=".bpmn,.dmn"
                    type="file"
                    name="file"
                    onChange={onFileChanged} />

                <SettingsSelect
                    disabled={false}
                    value={repository}
                    label="Target Repository"
                    onChanged={setRepository}>
                    {allRepos?.map(repo => (
                        <MenuItem
                            key={repo.bpmnRepositoryId}
                            value={repo.bpmnRepositoryId}>
                            {repo.bpmnRepositoryName}
                        </MenuItem>
                    ))}


                </SettingsSelect>

                <SettingsTextField
                    label="Title"
                    value={title}
                    onChanged={setTitle} />

                <SettingsTextField
                    label="Description"
                    value={description}
                    multiline
                    rows={3}
                    rowsMax={3}
                    onChanged={setDescription} />

            </SettingsForm>
            <ToastContainer/>
        </PopupDialog>
    );
};

export default UploadDiagramDialog;
