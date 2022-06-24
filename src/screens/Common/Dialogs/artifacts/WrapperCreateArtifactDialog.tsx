import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { ArtifactApi, ArtifactTypeTO, RepositoryTO } from "../../../../api";
import { apiExec, hasFailed } from "../../../../util/ApiUtils";
import { makeSuccessToast } from "../../../../util/ToastUtils";
import ArtifactDialog, { SimpleArtifact } from "./ArtifactDialog";

interface Props {
    types: ArtifactTypeTO[];
    type: string;
    repositories: RepositoryTO[];
    repositoryId?: string;
    open: boolean;
    onClose: (artifact: {
        repositoryId: string;
        artifactId: string;
    } | null) => void;
}

const WrapperCreateArtifactDialog: React.FC<Props> = props => {
    const { t } = useTranslation("common");

    const { repositoryId, repositories, types, type, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();

    const onCreate = useCallback(async (artifact: SimpleArtifact) => {
        setError(undefined);
        setDisabled(true);
        const response = await apiExec(ArtifactApi, api => api.createArtifact(artifact.repositoryId, {
            fileType: artifact.type,
            description: artifact.description || "",
            name: artifact.title
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        makeSuccessToast(t("artifact.created"));
        onClose({
            repositoryId: response.result.repositoryId,
            artifactId: response.result.id
        });
    }, [onClose, t]);

    return (
        <ArtifactDialog
            dialogTitleLabel={t(`artifact.create.${type}`)}
            dialogSaveButtonLabel={t("dialog.create")}
            action="create"
            artifactRepository={repositoryId}
            artifactType={type}
            repositories={repositories}
            types={types}
            open={open}
            onSave={onCreate}
            onClose={onClose}
            errorMsg={error}
            disabled={disabled} />
    );
};

export default WrapperCreateArtifactDialog;
