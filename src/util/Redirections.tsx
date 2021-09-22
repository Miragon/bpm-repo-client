import {ArtifactTypeTO, RepositoryTO, TeamTO} from "../api";

export const openFileInTool = (fileTypes: Array<ArtifactTypeTO>, fileType: string, repositoryId: string, artifactId: string, errorMessage: string, versionId?: string): void => {
    console.log(fileTypes)
    console.log(fileType)
    const urlNamespace = fileTypes.find((types: ArtifactTypeTO) => types.name.toLowerCase() === fileType.toLowerCase())?.url;
    console.log(urlNamespace);
    if (urlNamespace) {
        if (versionId) {
            window.open(`/${urlNamespace}/${artifactId}/${versionId}`, "_blank");
        } else {
            window.open(`/${urlNamespace}/${artifactId}/latest`, "_blank");
        }
    } else {
        alert("");
    }
}

export const getRepositoryUrl = (repository: RepositoryTO): string => {
    return `/repository/${repository.id}`;
};


export const getTeamUrl = (team: TeamTO): string => {
    return `/team/${team.id}`;
}