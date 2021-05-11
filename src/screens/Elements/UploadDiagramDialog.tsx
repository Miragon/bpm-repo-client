import { MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { ChangeEvent, useCallback, useState } from "react";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import { useStore } from "../../providers/RootStoreProvider";

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
    const store = useStore();

    const {
        open, onCancelled
    } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState("");
    const [file, setFile] = useState<string>("");

    const repositories = store.repoStore.getListOfRepoNamesAndIds();

    const onCreate = useCallback(async () => {
        const diagram = await store.diagramStore.createNewDiagram(title, description, repository);

        if (!diagram.bpmnDiagramId) {
            setError("Could not upload diagram.");
            return;
        }

        await store.versionStore.importDiagramVersion(repository, diagram.bpmnDiagramId, file);
        window.open((`/modeler/#/${repository}/${diagram.bpmnDiagramId}/latest/`))
        document.location.reload();
    }, [title, description, repository, store, file]);

    const onFileChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { target: { files } } = e;
        if (files != null && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
                if (typeof event.target?.result === "string") {
                    setFile(event.target?.result);
                }
            });
            reader.readAsDataURL(file);
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

                    {repositories.map(repo => (
                        <MenuItem key={repo.repoId} value={repo.repoId}>
                            {repo.repoName}
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

        </PopupDialog>
    );
};

export default UploadDiagramDialog;
