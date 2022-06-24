import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { ArtifactApi, RepositoryTO } from "../../../../api";
import { FileDescription } from "../../../../components/Files/FileListEntry";
import { apiExec, hasFailed } from "../../../../util/ApiUtils";
import { makeSuccessToast } from "../../../../util/ToastUtils";
import ArtifactDialog, { SimpleArtifact } from "./ArtifactDialog";

interface Props {
    open: boolean;
    onClose: (copied: boolean) => void;
    artifact: FileDescription | undefined;
    repositories: RepositoryTO[];
}

const WrapperCopyArtifactDialog: React.FC<Props> = props => {
    const { t } = useTranslation("common");

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();

    const title = `${props.artifact?.name}_copy`;
    const description = props.artifact?.description;
    const type = props.artifact?.fileType;

    const onCopy = useCallback(async (updatedArtifact: SimpleArtifact) => {
        const artifact = props.artifact;
        if (!artifact) {
            setError(t("validation.noFile"));
            return;
        }

        setDisabled(true);
        const response = await apiExec(ArtifactApi, api => api.copyToRepository(updatedArtifact.repositoryId, artifact.id, {
            description: updatedArtifact.description || "",
            name: updatedArtifact.title,
            fileType: updatedArtifact.type
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        makeSuccessToast("artifact.copied");
        props.onClose(true);
    }, [props, t]);

    return (
        <ArtifactDialog
            dialogTitleLabel={t("artifact.copyTo")}
            dialogSaveButtonLabel={t("artifact.copy")}
            action="copy"
            artifactTitle={title}
            artifactDescription={description}
            artifactType={type}
            repositories={props.repositories}
            types={[]}
            disabled={disabled}
            open={props.open}
            errorMsg={error}
            onSave={onCopy}
            onClose={() => props.onClose(false)} />
    );
};
export default WrapperCopyArtifactDialog;
