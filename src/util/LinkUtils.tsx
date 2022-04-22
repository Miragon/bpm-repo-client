import { ArtifactTypeTO } from "../api";

/**
 * This Method opens the most recent milestone of an artifact, except a number, which equals the
 * requested milestone number, is passed. The Editor uses this parameter (either a number, or
 * "latest") to request the file from backend
 */
export const openFileInTool = (fileTypes: Array<ArtifactTypeTO>, fileType: string, repositoryId: string, artifactId: string, milestone?: number): boolean => {
    const artifactType = fileTypes.find((types: ArtifactTypeTO) => types.name.toLowerCase() === fileType.toLowerCase());
    if (artifactType?.editable) {
        const urlNamespace = artifactType.url;
        if (milestone) {
            window.open(`/${urlNamespace}/#/${artifactId}/${milestone}`, "_blank");
        } else {
            window.open(`/${urlNamespace}/#/${artifactId}/latest`, "_blank");
        }
        return true;
    }
    else {
        return false;
    }
}

export const openRepository = (repositoryId: string): string => {
    return `/repository/${repositoryId}`;
};
