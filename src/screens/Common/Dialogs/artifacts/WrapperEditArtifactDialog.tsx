import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactApi } from "../../../../api";
import { FileDescription } from "../../../../components/Files/FileListEntry";
import { apiExec, hasFailed } from "../../../../util/ApiUtils";
import { makeSuccessToast } from "../../../../util/ToastUtils";
import ArtifactDialog, { SimpleArtifact } from "./ArtifactDialog";

interface Props {
    artifact: FileDescription | undefined;
    open: boolean;
    onClose: (saved: boolean) => void;
}

const WrapperEditArtifactDialog: React.FC<Props> = props => {
    const { t } = useTranslation("common");

    const { artifact, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();

    const onEdit = useCallback(async (updatedArtifact: SimpleArtifact) => {
        if (!artifact) {
            setError(t("validation.noFile"));
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(ArtifactApi, api => api.updateArtifact(artifact.id, {
            description: updatedArtifact.description || "",
            name: updatedArtifact.title
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        makeSuccessToast(t("artifact.changed"));
        onClose(true);
    }, [artifact, onClose, t]);

    return (
        <ArtifactDialog
            dialogTitleLabel={t("artifact.edit")}
            dialogSaveButtonLabel={t("dialog.applyChanges")}
            action="edit"
            artifactTitle={artifact?.name}
            artifactDescription={artifact?.description}
            artifactType={artifact?.fileType}
            artifactRepository={artifact?.repository?.id}
            repositories={[]}
            types={[]}
            disabled={disabled}
            open={open}
            errorMsg={error}
            onSave={onEdit}
            onClose={() => props.onClose(false)} />
    );
};

export default WrapperEditArtifactDialog;
