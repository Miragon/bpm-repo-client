import React, { useCallback, useState } from "react";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsTextField from "../../components/Form/SettingsTextField";
import { useStore } from "../../providers/RootStoreProvider";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onCreated: () => void;
}

const CreateRepoDialog: React.FC<Props> = props => {
    const store = useStore();

    const { open, onCancelled, onCreated } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const onCreate = useCallback(async () => {
        if (!(await store.repoStore.createRepo(title, description))) {
            setError("Could not create repository!");
        } else {
            onCreated();
        }
    }, [store.repoStore, onCreated, title, description]);

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title="Create New Repository"
            secondTitle="Cancel"
            onSecond={onCancelled}
            firstTitle="Create"
            onFirst={onCreate}>

            <SettingsForm large>

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

export default CreateRepoDialog;
