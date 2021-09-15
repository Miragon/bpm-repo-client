import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactTO, ArtifactTypeTO, RepositoryTO } from "../../api";
import ArtifactEntry from "../../components/Artifact/ArtifactEntry";
import { DropdownButtonItem } from "../../components/Form/DropdownButton";
import PopupSettings from "../../components/Form/PopupSettings";
import { SYNC_STATUS_ARTIFACT, SYNC_STATUS_FAVORITE } from "../../constants/Constants";
import { addToFavorites, deleteArtifact, getLatestVersion } from "../../store/actions";
import { RootState } from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import { openFileInTool } from "../../util/Redirections";
import CopyToRepoDialog from "../Dialogs/CopyToRepoDialog";
import EditArtifactDialog from "../Repository/Artifact/Dialogs/EditArtifactDialog";
import CreateVersionDialog from "./Artifact/Dialogs/CreateVersionDialog";
import SharingManagementDialog from "./Artifact/Dialogs/SharingManagementDialog";
import RepositoryArtifactDetails from "./RepositoryArtifactDetails";

interface Props {
    artifacts: ArtifactTO[];
    repositories: RepositoryTO[];
    favorites: ArtifactTO[];
    fallback?: string;
}

const OverviewArtifactList: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const {
        fallback,
        favorites,
        repositories,
        artifacts
    } = props;

    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);

    const [shareArtifact, setShareArtifact] = useState<ArtifactTO>();
    const [createVersionArtifact, setCreateVersionArtifact] = useState<ArtifactTO>();
    const [copyArtifact, setCopyArtifact] = useState<ArtifactTO>();
    const [editArtifact, setEditArtifact] = useState<ArtifactTO>();
    const [menu, setMenu] = useState<{
        target: Element;
        artifact: ArtifactTO;
        isFavorite: boolean;
        repository: string;
    }>();

    const onFavorite = useCallback(async (artifact: ArtifactTO) => {
        const response = await addToFavorites(artifact.id);
        if (Math.floor(response.status / 100) === 2) {
            dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
            dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: false })
        } else {
            helpers.makeErrorToast(t("artifact.couldNotSetStarred"), () => onFavorite(artifact))
        }
    }, [dispatch, t]);

    const onDownload = useCallback(async (artifact: ArtifactTO) => {
        const response = await getLatestVersion(artifact.id);
        if (Math.floor(response.status / 100) === 2) {
            helpers.download(response.data)
            helpers.makeSuccessToast(t("download.started"))
        } else {
            helpers.makeErrorToast(t(response.data.toString()), () => onDownload(artifact))
        }
    }, [t]);

    const onDelete = useCallback(async (artifact: ArtifactTO) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(t("artifact.confirmDelete", { artifactName: artifact.name }))) {
            try {
                const response = await dispatch(deleteArtifact(artifact.id));
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (response?.status === 200) {
                    helpers.makeSuccessToast(t("artifact.deleted"));
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    helpers.makeErrorToast(t(response.data), () => onDelete(artifact));
                }
            } catch (err) {
                console.log(err);
            }
        }
    }, [dispatch, t]);

    const onEdit = useCallback((artifact: ArtifactTO) => {
        setEditArtifact(artifact);
    }, []);

    const onOpen = useCallback((artifact: ArtifactTO) => {
        openFileInTool(fileTypes, artifact.fileType, artifact.repositoryId, artifact.id, t("error.missingTool", artifact.fileType));
    }, [fileTypes, t]);

    const onCreateVersion = useCallback((artifact: ArtifactTO) => {
        setCreateVersionArtifact(artifact);
    }, []);

    const onShare = useCallback((artifact: ArtifactTO) => {
        setShareArtifact(artifact);
    }, []);

    const onCopy = useCallback((artifact: ArtifactTO) => {
        setCopyArtifact(artifact);
    }, []);

    const options: DropdownButtonItem[] = useMemo(() => [
        {
            id: "OpenLatest",
            label: t("version.openLatest"),
            type: "button",
            onClick: () => menu && onOpen(menu.artifact)
        },
        {
            id: "CreateVersion",
            label: t("version.create"),
            type: "button",
            onClick: () => menu && onCreateVersion(menu.artifact)
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
    ], [menu, onCopy, onCreateVersion, onShare, onOpen, onDelete, onDownload, onEdit, t]);

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
                        favorite={helpers.isFavorite(artifact.id, favorites.map(artifact => artifact.id))}
                        repository={helpers.getRepoName(artifact.repositoryId, repositories)}>
                        <RepositoryArtifactDetails artifact={artifact} />
                    </ArtifactEntry>
                ))}
                {artifacts.length === 0 && (
                    <span>{t(fallback ?? "category.noFavoritesAvailable")}</span>
                )}
            </div>


            <PopupSettings
                open={!!menu}
                reference={menu?.target || null}
                onCancel={() => setMenu(undefined)}
                options={options} />

            <EditArtifactDialog
                open={!!editArtifact}
                onCancelled={() => setEditArtifact(undefined)}
                artifact={editArtifact} />

            <CreateVersionDialog
                open={!!createVersionArtifact}
                onCancelled={() => setCreateVersionArtifact(undefined)}
                onCreated={() => setCreateVersionArtifact(undefined)}
                artifact={createVersionArtifact} />

            <CopyToRepoDialog
                open={!!copyArtifact}
                onCancelled={() => setCopyArtifact(undefined)}
                artifact={copyArtifact} />

            <SharingManagementDialog
                open={!!shareArtifact}
                artifact={shareArtifact}
                onCancelled={() => setShareArtifact(undefined)} />

        </div>
    );
};

export default OverviewArtifactList;
