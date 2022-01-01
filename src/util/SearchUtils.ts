import { FileDescription } from "../components/Layout/Files/FileListEntry";

export const searchCaseInsensitive = (
    content: string | undefined,
    search: string | undefined
): boolean => {
    if (content === undefined || search === undefined) {
        return false;
    }

    return content.toLowerCase().indexOf(search.toLowerCase()) !== -1;
};

export const searchAllCaseInsensitive = (
    search: string | undefined,
    ...contents: (string | undefined | null)[]
): boolean => {
    if (search === undefined) {
        return false;
    }

    const searchLowerCase = search.toLocaleLowerCase();
    for (const c of contents) {
        if (c !== undefined && c !== null && c.toLowerCase().indexOf(searchLowerCase) !== -1) {
            return true;
        }
    }
    return false;
};

export const search = (
    content: string | undefined,
    searchValue: string | undefined
): boolean => {
    if (content === undefined || searchValue === undefined) {
        return false;
    }

    return content.indexOf(searchValue) !== -1;
};

export const filterArtifactList = (
    search: string | undefined,
    artifacts: FileDescription[]
): FileDescription[] => {
    return artifacts.filter(file => searchAllCaseInsensitive(
        search,
        file.fileType,
        file.name,
        file.description,
        file.lockedBy,
        file.repository?.name,
        file.repository?.description
    ));
};
