import { ArtifactTypeTO, RepositoryTO } from "../api";

export const openFileInTool = (fileTypes: Array<ArtifactTypeTO>, fileType: string, repositoryId: string, artifactId: string, errorMessage: string, versionId?: string): void => {
    const urlNamespace = fileTypes.find((types: ArtifactTypeTO) => types.name.toLowerCase() === fileType.toLowerCase())?.url;
    if (urlNamespace) {
        if (versionId) {
            window.open(`/${urlNamespace}/${artifactId}/${versionId}`, "_blank");
        } else {
            window.open(`/${urlNamespace}/${repositoryId}/${artifactId}/latest`, "_blank");
        }
    } else {
        alert("");
    }
}

export const getRepositoryUrl = (repository: RepositoryTO): string => {
    return `/repository/${repository.id}`;
};
