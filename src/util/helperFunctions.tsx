import {ArtifactTO, ArtifactVersionTO, RepositoryTO} from "../api";
import {Dispatch, useCallback} from "react";
import {LATEST_VERSION} from "../constants/Constants";

const helpers = {
    isNumber: (value: string): boolean => {
        return !isNaN(Number(value));
    },
    isPositiveInt: (value: string): boolean => {
        return /^\d+$/.test(value);
    },
    throwError: (errorMessage: string): boolean => {
        throw new Error(errorMessage);
    },

    getClientConfig: (): Record<string, string> => {
        return {
            // basePath: "",
            //         "headers": {
            //             'Authorization': `${token}`,
            //         }

        };
    },
    isFavorite: (id: string, favoriteArtifactIds: Array<string>): boolean => {
        if(favoriteArtifactIds.includes(id)){
            return true;
        }
        else {
            return false;
        }
    },
    reformatDate: (date: string | undefined): string => {
        const language = window.localStorage.getItem("language") ? window.localStorage.getItem("language") : "default";
        if(language === "custom") {
            if (date) {
                const standardDate = `${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)}`
                const time = date.split("T")[1].substring(0, 5);
                return `${standardDate} | ${time}`;
            }
        }
        else {
            if(date) {
                const americanDate = `${date.substring(5, 7)}.${date.substring(8, 10)}.${date.substring(0, 4)}`
                const time = date.split("T")[1].substring(0, 5);
                return `${americanDate} | ${time}`;
            }
        }
        return "01.01.2000";
    },

    getRepoName: (repoId: string, repos: Array<RepositoryTO>): string => {
        const assignedRepo = repos.find(repo => repo.id === repoId);
        return assignedRepo ? assignedRepo.name : "";
    },

    download: ((latestVersion: ArtifactVersionTO, dispatch: Dispatch<any>) => {
        const filePath = `/api/version/${latestVersion.artifactId}/${latestVersion.id}/download`
        const link = document.createElement("a");
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
        link.click();
        dispatch({type: LATEST_VERSION, latestVersion: null})
    }),

    compareCreated: (a: ArtifactTO, b: ArtifactTO) => {
        const c = new Date(a.createdDate)
        const d = new Date(b.createdDate)
        if(c < d) {
            return 1;
        }
        if(c > d) {
            return -1;
        }
        return 0;
    },
    compareEdited: (a: ArtifactTO, b: ArtifactTO) => {
        const c = new Date(a.updatedDate)
        const d = new Date(b.updatedDate)
        if(c < d) {
            return 1;
        }
        if(c > d) {
            return -1;
        }
        return 0;
    },
    compareName: (a: ArtifactTO, b: ArtifactTO) => {
        if(a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if(a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    }
};

export default helpers;
