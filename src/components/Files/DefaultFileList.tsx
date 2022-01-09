import {
    CloudDownloadOutlined,
    DeleteOutlineOutlined,
    EditOutlined,
    FolderOutlined
} from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ArtifactApi, ArtifactTypeTO, MilestoneApi } from "../../api";
import DeleteArtifactDialog from "../../screens/Common/Dialogs/DeleteArtifactDialog";
import EditArtifactDialog from "../../screens/Common/Dialogs/EditArtifactDialog";
import { loadFavoriteArtifacts } from "../../store/FavoriteArtifactState";
import { apiExec, hasFailed } from "../../util/ApiUtils";
import { downloadFile } from "../../util/FileUtils";
import { openFileInTool, openRepository } from "../../util/LinkUtils";
import { makeErrorToast, makeSuccessToast } from "../../util/ToastUtils";
import Pagination from "../List/Pagination";
import { usePagination } from "../List/usePagination";
import FileList from "./FileList";
import { FileDescription } from "./FileListEntry";

const DEFAULT_OPTIONS = [
    [
        {
            label: "artifact.showInRepo",
            value: "show-repository",
            icon: FolderOutlined
        }
    ],
    [
        {
            label: "artifact.download",
            value: "download-file",
            icon: CloudDownloadOutlined
        },
        {
            label: "artifact.edit",
            value: "edit-file",
            icon: EditOutlined
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
    files: FileDescription[];
    fallback: string;
    className?: string;
    pageSize?: number;
    reloadFiles: () => void;
    artifactTypes: ArtifactTypeTO[];
}

const DefaultFileList: React.FC<Props> = props => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { t } = useTranslation("common");

    const [editArtifact, setEditArtifact] = useState<FileDescription>();
    const [deleteArtifact, setDeleteArtifact] = useState<FileDescription>();

    const { pageItems, paginationConfig } = usePagination(props.files, props.pageSize ?? 5);

    const onFavoriteClicked = useCallback(async (file: FileDescription) => {
        const response = await apiExec(ArtifactApi, api => api.setStarred(file.id));
        if (hasFailed(response)) {
            if (response.error) {
                makeErrorToast(t(response.error));
            } else {
                makeErrorToast(t("artifact.favoriteFailed"));
            }
            return;
        }

        makeSuccessToast(t("artifact.favoriteSaved"));
        dispatch(loadFavoriteArtifacts(true));
    }, [dispatch, t]);

    const onMenuEntryClicked = useCallback(async (action: string, file: FileDescription) => {
        switch (action) {
            case "show-repository": {
                file.repository && history.push(openRepository(file.repository.id));
                break;
            }
            case "download-file": {
                const response = await apiExec(MilestoneApi, api => api.getLatestMilestone(file.id));
                if (hasFailed(response)) {
                    if (response.error) {
                        makeErrorToast(t(response.error));
                    } else {
                        makeErrorToast(t("artifact.downloadFailed"));
                    }
                    return;
                }

                downloadFile(response.result);
                makeSuccessToast(t("artifact.downloadStarted"));
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
    }, [history, t]);

    return (
        <>
            <FileList
                files={pageItems}
                className={props.className}
                fallback={props.fallback}
                onFavorite={onFavoriteClicked}
                onClick={file => file.repository && openFileInTool(props.artifactTypes, file.fileType, file.repository.id, file.id)}
                onMenuClick={onMenuEntryClicked}
                menuEntries={DEFAULT_OPTIONS} />
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
        </>
    );
};

export default DefaultFileList;
