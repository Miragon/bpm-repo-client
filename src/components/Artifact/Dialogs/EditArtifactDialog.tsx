import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ArtifactTO } from "../../../api";
import { updateArtifact } from "../../../store/actions";
import { SYNC_STATUS_ARTIFACT } from "../../../constants/Constants";
import PopupDialog from "../../Shared/Form/PopupDialog";
import SettingsTextField from "../../Shared/Form/SettingsTextField";
import { makeErrorToast, makeSuccessToast } from "../../../util/toastUtils";

interface Props {
    open: boolean;
    onCancelled: () => void;
    artifact: ArtifactTO | undefined;
}

const EditArtifactDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");
    const { artifact } = props;
    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>(props.artifact?.name || "");
    const [description, setDescription] = useState<string>(props.artifact?.description || "");

    useEffect(() => {
        artifact && setTitle(artifact.name);
        artifact && setDescription(artifact.description);
    }, [artifact]);

    const applyChanges = useCallback(async () => {
        if (!artifact) {
            return;
        }

        if (!title) {
            setError(t("exception.emptyTitle"));
            return;
        }

        updateArtifact(title, description, artifact.id).then(response => {
            if (Math.floor(response.status / 100) !== 2) {
                makeErrorToast(t(response.data.toString()), () => applyChanges());
                return;
            }
            dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
            makeSuccessToast(t("artifact.changed"));
            props.onCancelled();
        }, err => {
            makeErrorToast(t(typeof err.response.data === "string" ? err.response.data : err.response.data.error), () => applyChanges());
        });
    }, [artifact, props, title, description, t, dispatch]);

    return (
        <PopupDialog
            open={props.open}
            title={props.artifact?.name || ""}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("dialog.applyChanges")}
            onFirst={applyChanges}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}>
            <SettingsTextField
                label={t("properties.title")}
                value={title}
                onChanged={setTitle} />

            <SettingsTextField
                label={t("properties.description")}
                value={description}
                onChanged={setDescription}
                multiline
                minRows={4} />

        </PopupDialog>
    );
};

export default EditArtifactDialog;
