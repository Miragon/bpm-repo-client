import React, {useCallback, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, ArtifactTypeTO, RepositoryTO} from "../../api";
import ArtifactEntry from "../../components/Artifact/ArtifactEntry";
import {SYNC_STATUS_ARTIFACT, SYNC_STATUS_FAVORITE} from "../../constants/Constants";
import {addToFavorites, deleteArtifact, getLatestMilestone} from "../../store/actions";
import {RootState} from "../../store/reducers/rootReducer";
import {openFileInTool} from "../../util/Redirections";
import MilestoneList from "./MilestoneList";
import {DropdownButtonItem} from "../../components/Shared/Form/DropdownButton";
import PopupSettings from "../../components/Shared/Form/PopupSettings";
import EditArtifactDialog from "../../components/Artifact/Dialogs/EditArtifactDialog";
import CreateMilestoneDialog from "../../components/Artifact/Dialogs/CreateMilestoneDialog";
import CopyToRepoDialog from "../../components/Shared/Dialogs/CopyToRepoDialog";
import SharingManagementDialog from "../../components/Artifact/Dialogs/SharingManagementDialog";
import {makeErrorToast, makeSuccessToast} from "../../util/toastUtils";
import {download} from "../../util/downloadUtils";

interface Props {
    repoId: string;
    artifacts: ArtifactTO[];
    repositories: RepositoryTO[];
    favorites: ArtifactTO[];
    fallback?: string;
}

const ArtifactListWithMilestones: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const {
        fallback,
        favorites,
        repositories,
        artifacts
    } = props;

    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);

    const [shareArtifact, setShareArtifact] = useState<ArtifactTO>();
    const [createMilestoneArtifact, setCreateMilestoneArtifact] = useState<ArtifactTO>();
    const [copyArtifact, setCopyArtifact] = useState<ArtifactTO>();
    const [editArtifact, setEditArtifact] = useState<ArtifactTO>();
    const [menu, setMenu] = useState<{
        target: Element;
        artifact: ArtifactTO;
        isFavorite: boolean;
        repository: string;
    }>();

    const onFavorite = useCallback(async (artifact: ArtifactTO) => {
        addToFavorites(artifact.id).then(response => {
            if (Math.floor(response.status / 100) !== 2) {
                makeErrorToast(t("artifact.couldNotSetStarred"), () => onFavorite(artifact));
                return;
            }

            dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false});
            dispatch({type: SYNC_STATUS_FAVORITE, dataSynced: false});

        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onFavorite(artifact))
        })

    }, [dispatch, t]);

    const onDownload = useCallback(async (artifact: ArtifactTO) => {
        getLatestMilestone(artifact.id).then(response => {
            if (Math.floor(response.status / 100) !== 2) {
                makeErrorToast(t(response.data.toString()), () => onDownload(artifact));
                return;
            }

            download(response.data)
            makeSuccessToast(t("download.started"))

        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onDownload(artifact))
        })
    }, [t]);


    const onDelete = useCallback(async (artifact: ArtifactTO) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(t("artifact.confirmDelete", {artifactName: artifact.name}))) {
            deleteArtifact(artifact.id).then(response => {
                if (Math.floor(response.status / 100) !== 2) {
                    makeErrorToast(t(response.statusText), () => onDelete(artifact));
                    return;
                }

                makeSuccessToast(t("artifact.deleted"));
                dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false});

            }, error => {
                makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onDelete(artifact))
            })
        }
    }, [dispatch, t]);


    const onEdit = useCallback((artifact: ArtifactTO) => {
        setEditArtifact(artifact);
    }, []);

    const onOpen = useCallback((artifact: ArtifactTO) => {
        openFileInTool(fileTypes, artifact.fileType, artifact.repositoryId, artifact.id, t("error.missingTool", artifact.fileType));
    }, [fileTypes, t]);

    const onCreateMilestone = useCallback((artifact: ArtifactTO) => {
        setCreateMilestoneArtifact(artifact);
    }, []);

    const onShare = useCallback((artifact: ArtifactTO) => {
        setShareArtifact(artifact);
    }, []);

    const onCopy = useCallback((artifact: ArtifactTO) => {
        setCopyArtifact(artifact);
    }, []);

    const getRepoName = (repoId: string, repos: Array<RepositoryTO>): string => {
        const assignedRepo = repos.find(repo => repo.id === repoId);
        return assignedRepo ? assignedRepo.name : "";
    }

    const options: DropdownButtonItem[] = useMemo(() => [
        {
            id: "OpenLatest",
            label: t("milestone.openLatest"),
            type: "button",
            onClick: () => menu && onOpen(menu.artifact)
        },
        {
            id: "CreateMilestone",
            label: t("milestone.create"),
            type: "button",
            onClick: () => menu && onCreateMilestone(menu.artifact)
        },
        {
            id: "divider1",
            type: "divider",
            label: ""
        },
        {
            id: "EditArtifact",
            label: t("artifact.edit"),
            type: "button",
            onClick: () => menu && onEdit(menu.artifact)
        },
        {
            id: "ShareWithRepository",
            label: t("artifact.share"),
            type: "button",
            onClick: () => menu && onShare(menu.artifact)
        },
        {
            id: "DownloadArtifact",
            label: t("artifact.download"),
            type: "button",
            onClick: () => menu && onDownload(menu.artifact)
        },
        {
            id: "divider2",
            type: "divider",
            label: ""
        },
        {
            id: "CopyToRepository",
            label: t("artifact.copyTo"),
            type: "button",
            onClick: () => menu && onCopy(menu.artifact)
        },
        {
            id: "divider3",
            type: "divider",
            label: ""
        },
        {
            id: "DeleteArtifact",
            label: t("artifact.delete"),
            type: "button",
            onClick: () => menu && onDelete(menu.artifact)
        }
    ], [menu, onCopy, onCreateMilestone, onShare, onOpen, onDelete, onDownload, onEdit, t]);

    return (
        <div>
            <div>
                {artifacts?.map(artifact => (
                    <ArtifactEntry
                        expandable
                        key={artifact.id}
                        artifact={artifact}
                        // If menu is already open for the same element, close it
                        onMenuClicked={data => setMenu(cur => cur?.artifact.id === data.artifact.id ? undefined : data)}
                        onFavorite={onFavorite}
                        favorite={favorites.map(artifact => artifact.id).includes(artifact.id)}
                        repository={getRepoName(artifact.repositoryId, repositories)}>
                        <MilestoneList artifact={artifact}/>
                    </ArtifactEntry>
                ))}
                {artifacts.length === 0 && (
                    <span>{t(fallback ?? "artifact.notAvailable")}</span>
                )}
            </div>


            <PopupSettings
                open={!!menu}
                reference={menu?.target || null}
                onCancel={() => setMenu(undefined)}
                options={options}/>

            <EditArtifactDialog
                open={!!editArtifact}
                onCancelled={() => setEditArtifact(undefined)}
                artifact={editArtifact}/>

            <CreateMilestoneDialog
                open={!!createMilestoneArtifact}
                onCancelled={() => setCreateMilestoneArtifact(undefined)}
                onCreated={() => setCreateMilestoneArtifact(undefined)}
                artifact={createMilestoneArtifact}/>

            <CopyToRepoDialog
                repoId={props.repoId}
                open={!!copyArtifact}
                onCancelled={() => setCopyArtifact(undefined)}
                artifact={copyArtifact}/>

            <SharingManagementDialog
                open={!!shareArtifact}
                artifact={shareArtifact}
                onCancelled={() => setShareArtifact(undefined)}/>

        </div>
    );
};

export default ArtifactListWithMilestones;
