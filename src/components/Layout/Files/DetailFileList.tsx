import {
    CloudDownloadOutlined,
    CreateNewFolderOutlined,
    DeleteOutlineOutlined,
    EditOutlined,
    HistoryOutlined,
    LaunchOutlined,
    SaveOutlined,
    ShareOutlined
} from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ArtifactApi, ArtifactTypeTO, MilestoneApi, RepositoryTO } from "../../../api";
import CopyArtifactDialog from "../../../screens/Common/CopyArtifactDialog";
import CreateMilestoneDialog from "../../../screens/Common/CreateMilestoneDialog";
import DeleteArtifactDialog from "../../../screens/Common/DeleteArtifactDialog";
import EditArtifactDialog from "../../../screens/Common/EditArtifactDialog";
import ListMilestonesDialog from "../../../screens/Common/ListMilestonesDialog";
import ShareArtifactDialog from "../../../screens/Common/ShareArtifactDialog";
import { loadFavoriteArtifacts } from "../../../store/FavoriteArtifactState";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import helpers from "../../../util/helperFunctions";
import { usePagination } from "../../../util/hooks/usePagination";
import { openFileInTool } from "../../../util/Redirections";
import Pagination from "../List/Pagination";
import FileList from "./FileList";
import { FileDescription } from "./FileListEntry";

const DETAIL_OPTIONS = [
    [
        {
            label: "milestone.openLatest",
            value: "open-latest",
            icon: LaunchOutlined
        },
        {
            label: "milestone.create",
            value: "create-milestone",
            icon: SaveOutlined
        },
        {
            label: "milestone.list",
            value: "list-milestones",
            icon: HistoryOutlined
        }
    ],
    [
        {
            label: "artifact.edit",
            value: "edit-file",
            icon: EditOutlined
        },
        {
            label: "artifact.share",
            value: "share-file",
            icon: ShareOutlined
        },
        {
            label: "artifact.download",
            value: "download-file",
            icon: CloudDownloadOutlined
        }
    ],
    [
        {
            label: "artifact.copyTo",
            value: "copy-file",
            icon: CreateNewFolderOutlined
        }
    ],
    [
        {
            label: "artifact.delete",
            value: "delete-file",
            icon: DeleteOutlineOutlined
        }
    ]
];

interface Props {
    fallback: string;
    targets: string[];
    className?: string;
    reloadFiles: () => void;
    files: FileDescription[];
    repositories: RepositoryTO[];
    ownRepositories: RepositoryTO[];
    artifactTypes: ArtifactTypeTO[];
}

const DefaultFileList: React.FC<Props> = props => {
    const dispatch = useDispatch();

    const { t } = useTranslation("common");

    const [createMilestoneArtifact, setCreateMilestoneArtifact] = useState<FileDescription>();
    const [listMilestonesArtifact, setListMilestonesArtifact] = useState<FileDescription>();
    const [shareArtifact, setShareArtifact] = useState<FileDescription>();
    const [copyArtifact, setCopyArtifact] = useState<FileDescription>();
    const [editArtifact, setEditArtifact] = useState<FileDescription>();
    const [deleteArtifact, setDeleteArtifact] = useState<FileDescription>();

    const { pageItems, paginationConfig } = usePagination(props.files, 10);

    const onFavoriteClicked = useCallback(async (file: FileDescription) => {
        const response = await apiExec(ArtifactApi, api => api.setStarred(file.id));
        if (hasFailed(response)) {
            if (response.error) {
                helpers.makeErrorToast(t(response.error));
            } else {
                helpers.makeErrorToast("Favorit konnte nicht gespeichert werden.");
            }
            return;
        }

        helpers.makeSuccessToast("Favorit gespeichert");
        dispatch(loadFavoriteArtifacts(true));
    }, [dispatch, t]);

    const onMenuEntryClicked = useCallback(async (action: string, file: FileDescription) => {
        switch (action) {
            case "open-latest": {
                if (file.repository) {
                    openFileInTool(props.artifactTypes, file.fileType, file.repository.id, file.id);
                }
                break;
            }
            case "list-milestones": {
                setListMilestonesArtifact(file);
                break;
            }
            case "create-milestone": {
                setCreateMilestoneArtifact(file);
                break;
            }
            case "share-file": {
                setShareArtifact(file);
                break;
            }
            case "copy-file": {
                setCopyArtifact(file);
                break;
            }
            case "download-file": {
                const response = await apiExec(MilestoneApi, api => api.getLatestMilestone(file.id));
                if (hasFailed(response)) {
                    if (response.error) {
                        helpers.makeErrorToast(t(response.error));
                    } else {
                        helpers.makeErrorToast("Download fehlgeschlagen.");
                    }
                    return;
                }

                helpers.download(response.result);
                helpers.makeSuccessToast(t("download.started"));
                break;
            }
            case "edit-file": {
                setEditArtifact(file);
                break;
            }
            case "delete-file": {
                setDeleteArtifact(file);
                break;
            }
        }
    }, [props.artifactTypes, t]);

    return (
        <>
            <FileList
                files={pageItems}
                className={props.className}
                fallback={props.fallback}
                onFavorite={onFavoriteClicked}
                onClick={file => file.repository && openFileInTool(props.artifactTypes, file.fileType, file.repository.id, file.id)}
                onMenuClick={onMenuEntryClicked}
                menuEntries={DETAIL_OPTIONS} />
            <Pagination config={paginationConfig} />
            <EditArtifactDialog
                onClose={saved => {
                    setEditArtifact(undefined);
                    saved && props.reloadFiles();
                }}
                open={!!editArtifact}
                artifact={editArtifact} />
            <DeleteArtifactDialog
                onClose={deleted => {
                    setDeleteArtifact(undefined);
                    deleted && props.reloadFiles();
                }}
                open={!!deleteArtifact}
                artifact={deleteArtifact} />
            <CopyArtifactDialog
                open={!!copyArtifact}
                onClose={() => setCopyArtifact(undefined)}
                artifact={copyArtifact}
                repositories={props.repositories} />
            <ShareArtifactDialog
                open={!!shareArtifact}
                artifact={shareArtifact}
                ownRepositories={props.ownRepositories}
                onClose={() => setShareArtifact(undefined)} />
            <CreateMilestoneDialog
                open={!!createMilestoneArtifact}
                artifact={createMilestoneArtifact}
                onClose={() => setCreateMilestoneArtifact(undefined)} />
            <ListMilestonesDialog
                targets={props.targets}
                onChanged={props.reloadFiles}
                open={!!listMilestonesArtifact}
                artifact={listMilestonesArtifact}
                onClose={() => setListMilestonesArtifact(undefined)} />
        </>
    );
};

export default DefaultFileList;
