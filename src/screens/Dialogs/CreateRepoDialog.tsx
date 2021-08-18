import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {useTranslation} from "react-i18next";
import {createRepository} from "../../store/actions";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onCreated: () => void;
}

const CreateRepoDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const { open, onCancelled, onCreated } = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const onCreate = useCallback(() => {
        try {
            dispatch(createRepository(title, description));
            setTitle("");
            setDescription("");
            onCancelled();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch, title, description, onCancelled]);

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
                onCreated();
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
                    rows={3}
                    rowsMax={3}
                    onChanged={setDescription} />

            </SettingsForm>

        </PopupDialog>
    );
};

export default CreateRepoDialog;
