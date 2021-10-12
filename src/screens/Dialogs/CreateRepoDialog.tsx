import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {useTranslation} from "react-i18next";
import {createRepository} from "../../store/actions";
import helpers from "../../util/helperFunctions";
import {SYNC_STATUS_REPOSITORY} from "../../constants/Constants";

interface Props {
    open: boolean;
    onCancelled: () => void;
}

const CreateRepoDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const { open, onCancelled } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const onCreate = useCallback(async() => {
        createRepository(title, description).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                setTitle("")
                setDescription("")
                onCancelled()
            } else {
                helpers.makeErrorToast(response.data.toString(), () => onCreate())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => onCreate())
        })

    }, [title, description, dispatch, onCancelled, t]);

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={t("repository.create")}
            secondTitle={t("dialog.cancel")}
            onSecond={onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={() => {
                onCreate();
            }} >

            <SettingsForm large>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    onChanged={setTitle} />

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    minRows={3}
                    rowsMax={3}
                    onChanged={setDescription} />

            </SettingsForm>

        </PopupDialog>
    );
};

export default CreateRepoDialog;
