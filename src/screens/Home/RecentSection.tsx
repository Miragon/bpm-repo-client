import {
    CloudDownloadOutlined,
    DeleteOutlineOutlined,
    EditOutlined,
    FolderOutlined
} from "@material-ui/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactTO, RepositoryTO } from "../../api";
import FileList from "../../components/Layout/Files/FileList";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import Pagination from "../../components/Layout/List/Pagination";
import { RECENT_ARTIFACTS, SYNC_STATUS_ARTIFACT } from "../../constants/Constants";
import { fetchRecentArtifacts } from "../../store/actions";
import { RootState } from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";

const RECENT_OPTIONS = [
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

const PAGE_SIZE = 5;

const RecentArtifacts: React.FC = (() => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const [recentArtifacts, setRecentArtifacts] = useState<ArtifactTO[]>([]);
    const [currentPage, setCurrentPage] = useState(0);

    const repos: RepositoryTO[] = useSelector((state: RootState) => state.repos.repos);
    const recentSynced: boolean = useSelector((state: RootState) => state.dataSynced.recentSynced);
    const favoriteArtifacts: ArtifactTO[] = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);

    const fetchRecent = useCallback(() => {
        fetchRecentArtifacts().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: RECENT_ARTIFACTS, recentArtifacts: response.data });
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true })
                setRecentArtifacts(response.data);
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchRecent())
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchRecent())
        })
    }, [dispatch, t]);

    useEffect(() => {
        if (!recentSynced) {
            fetchRecent();
        }
    }, [fetchRecent, recentSynced]);

    const files: FileDescription[] = useMemo(() => recentArtifacts.map(artifact => ({
        ...artifact,
        favorite: !!favoriteArtifacts?.find(a => a.id === artifact.id),
        repository: repos?.find(r => r.id === artifact.repositoryId)
    })), [recentArtifacts, repos, favoriteArtifacts]);

    const startIndex = PAGE_SIZE * currentPage;
    const endIndex = Math.min(files.length, startIndex + PAGE_SIZE);
    const pageFiles = files.slice(startIndex, endIndex);

    return (
        <>
            <FileList
                files={pageFiles}
                fallback="recents.notAvailable"
                onFavorite={console.log}
                onClick={console.log}
                onMenuClick={console.log}
                menuEntries={RECENT_OPTIONS} />
            <Pagination
                currentPage={currentPage}
                itemsPerPage={PAGE_SIZE}
                totalItems={files.length}
                onPage={setCurrentPage} />
        </>
    );
});

export default RecentArtifacts;
