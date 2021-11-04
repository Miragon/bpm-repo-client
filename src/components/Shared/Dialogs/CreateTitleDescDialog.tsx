import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {AxiosResponse} from "axios";
import {useTranslation} from "react-i18next";
import PopupDialog from "../Form/PopupDialog";
import SettingsForm from "../Form/SettingsForm";
import SettingsTextField from "../Form/SettingsTextField";
import {makeErrorToast, makeSuccessToast} from "../../../util/toastUtils";


interface Props {
    open: boolean;
    onCancelled: () => void;
    title: string;
    successMessage: string;
    createMethod: (title: string, description: string) => Promise<AxiosResponse>;
    //Key required to update the state after a new object has been created
    dataSyncedType: string;
}

const CreateTitleDescDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const {open, onCancelled} = props;

    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const onCreate = useCallback(async () => {
        props.createMethod(title, description).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: props.dataSyncedType, dataSynced: false})
                makeSuccessToast(props.successMessage)
                setTitle("")
                setDescription("")
                onCancelled()
            } else {
                makeErrorToast(response.data.toString(), () => onCreate())
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onCreate())
        })

    }, [props, title, description, dispatch, onCancelled, t]);

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={props.title}
            secondTitle={t("dialog.cancel")}
            onSecond={onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={() => {
                onCreate();
            }}>

            <SettingsForm large>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    onChanged={setTitle}/>

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription}/>

            </SettingsForm>

        </PopupDialog>
    );
};

export default CreateTitleDescDialog;
