import {DateTime} from "luxon";
import React, {ReactText} from "react";
import {TFunction} from "react-i18next";
import {toast} from "react-toastify";
import {ArtifactMilestoneTO, ArtifactTO, DeploymentTO, RepositoryTO} from "../api";
import Toast from "../components/Layout/Toast";
import theme from "../theme";

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
        return favoriteArtifactIds.includes(id);
    },
    reformatDate: (date: string | undefined): string => {
        const language = window.localStorage.getItem("language") ? window.localStorage.getItem("language") : "default";
        if (language === "custom") {
            if (date) {
                const standardDate = `${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)}`
                const time = date.split("T")[1].substring(0, 5);
                return `${standardDate} | ${time}`;
            }
        } else {
            if (date) {
                const americanDate = `${date.substring(5, 7)}/${date.substring(8, 10)}/${date.substring(0, 4)}`
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

    download: ((artifactMilestone: ArtifactMilestoneTO): void => {
        const filePath = `/api/milestone/${artifactMilestone.artifactId}/${artifactMilestone.id}/download`
        const link = document.createElement("a");
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
        link.click();
    }),

    compareTimestamp: (a: DeploymentTO, b: DeploymentTO): number => {
        const c = new Date(a.timestamp)
        const d = new Date(b.timestamp)
        if(c < d) {
            return 1;
        }
        if(c > d) {
            return -1;
        }
        return 0;
    },

    compareCreated: (a: ArtifactTO, b: ArtifactTO): number => {
        const c = new Date(a.createdDate)
        const d = new Date(b.createdDate)
        if (c < d) {
            return 1;
        }
        if (c > d) {
            return -1;
        }
        return 0;
    },
    compareEdited: (a: ArtifactTO, b: ArtifactTO): number => {
        const c = new Date(a.updatedDate)
        const d = new Date(b.updatedDate)
        if (c < d) {
            return 1;
        }
        if (c > d) {
            return -1;
        }
        return 0;
    },
    compareName: (a: ArtifactTO, b: ArtifactTO): number => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return 0;
    },

    makeSuccessToast: (message: string): ReactText => {
        return toast(<Toast errorMessage={message} isError={false} />, {
            autoClose: 4000,
            pauseOnHover: true,
            progressStyle: {
                background: theme.palette.primary.main,
            },
            style: {
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
            }
        })
    },

    makeErrorToast: (message: string, retryMethod: () => void): ReactText => {
        return toast(<Toast errorMessage={message} isError={true}
            retryMethod={() => retryMethod()} />, {
            autoClose: 8000,
            pauseOnHover: true,
            progressStyle: {
                background: theme.palette.primary.main,
            },
            style: {
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
            }
        })
    },

    formatTimeSince: (date: string, t: TFunction<string>): string => {
        const parsed = DateTime.fromISO(date);
        const duration = -parsed.diffNow().as("seconds");

        if (duration < 10) {
            return t("duration.ago.fewSeconds");
        }

        if (duration < 60) {
            return t("duration.ago.lessThanOneMinute");
        }

        if (duration < 120) {
            return t("duration.ago.oneMinute");
        }

        if (duration < 3600) {
            return t("duration.ago.minutes", { minutes: Math.floor(duration / 60) });
        }

        if (duration < 7200) {
            return t("duration.ago.oneHour");
        }

        if (duration < 86400) {
            return t("duration.ago.hours", { hours: Math.floor(duration / 3600) });
        }

        if (duration < 172800) {
            return t("duration.ago.oneDay");
        }

        return parsed.toLocaleString(DateTime.DATE_SHORT);

    }

};


export default helpers;
