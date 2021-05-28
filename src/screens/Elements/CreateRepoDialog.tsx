import React, {useCallback, useState} from "react";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {useDispatch} from "react-redux";
import * as repositoryAction from "../../store/actions/repositoryAction";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onCreated: () => void;
}

const CreateRepoDialog: React.FC<Props> = props => {

    const dispatch = useDispatch();

    const { open, onCancelled, onCreated } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");


    const onCreate = useCallback(() => {
        try{
            console.log(title + "    " + description)
            dispatch(repositoryAction.createRepository(title, description))
        } catch (err) {
            console.log(err)
        }
    }, [dispatch, title, description])


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title="Create New Repository"
            secondTitle="Cancel"
            onSecond={onCancelled}
            firstTitle="Create"
            onFirst={() => {
                onCreate()
                onCreated()}
            }>

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
