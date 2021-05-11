import { MenuItem } from '@material-ui/core';
import React, { useCallback, useState } from "react";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import { useStore } from "../../providers/RootStoreProvider";

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: "bpmn" | "dmn";
}

const CreateDiagramDialog: React.FC<Props> = props => {
    const store = useStore();

    const {
        open, onCancelled, type
    } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState("");

    const repositories = store.repoStore.getListOfRepoNamesAndIds();

    const onCreate = useCallback(async () => {
        const diagram = await store.diagramStore.createNewDiagram(title, description, repository);

        if (!diagram.bpmnDiagramId) {
            setError("Could not create diagram.");
            return;
        }

        await store.versionStore.createDiagramVersion(repository, diagram.bpmnDiagramId, type);
        window.open("/modeler/#/" + repository + "/" + diagram.bpmnDiagramId + "/latest/");
        document.location.reload();
    }, [title, description, repository, type, store]);

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={`Create ${type === "bpmn" ? "BPMN" : "DMN"} Diagram`}
            secondTitle="Cancel"
            onSecond={onCancelled}
            firstTitle="Create"
            onFirst={onCreate}>

            <SettingsForm large>

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

export default CreateDiagramDialog;
