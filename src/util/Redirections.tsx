import {ArtifactTypeTO, RepositoryTO} from "../api";


/**
 *  This Method opens the most recent milestone of an artifact, except a number, which equals the requested milestone number, is passed.
 *  The Editor uses this parameter (either a number, or "latest") to request the file from backend
 */
export const openFileInTool = (fileTypes: Array<ArtifactTypeTO>, fileType: string, repositoryId: string, artifactId: string, errorMessage: string, milestone?: number): void => {

    const urlNamespace = fileTypes.find((types: ArtifactTypeTO) => types.name.toLowerCase() === fileType.toLowerCase())?.url;
    if (urlNamespace) {
        if (milestone) {
            window.open(`/${urlNamespace}/#/${artifactId}/${milestone}`, "_blank");
        } else {
            window.open(`/${urlNamespace}/#/${artifactId}/latest`, "_blank");
        }
    } else {
        alert("");
    }
}

export const getRepositoryUrl = (repository: RepositoryTO): string => {
    return `/repository/${repository.id}`;
};


/*
export const getTeamUrl = (team: TeamTO): string => {
    return `/team/${team.id}`;
}
*/


