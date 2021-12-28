import {
    CloudDownloadOutlined,
    DeleteOutlineOutlined,
    EditOutlined,
    FolderOutlined
} from "@material-ui/icons";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactTO, RepositoryTO } from "../../api";
import FileList from "../../components/Layout/Files/FileList";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import Pagination from "../../components/Layout/List/Pagination";
import { FAVORITE_ARTIFACTS, SYNC_STATUS_FAVORITE } from "../../constants/Constants";
import { fetchFavoriteArtifacts } from "../../store/actions";
import { RootState } from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";


const FAVORITE_OPTIONS = [
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
]

const PAGE_SIZE = 5;

const FavoriteArtifacts: React.FC = observer(() => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const [currentPage, setCurrentPage] = useState(0);

    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.favoriteSynced);

    const fetchFavorite = useCallback(() => {
        fetchFavoriteArtifacts().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: FAVORITE_ARTIFACTS, favoriteArtifacts: response.data });
                dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: true })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchFavorite())
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchFavorite())
        })

    }, [dispatch, t]);

    useEffect(() => {
        if (!syncStatus) {
            fetchFavorite();
        }
    }, [syncStatus, fetchFavorite])

    const files: FileDescription[] = useMemo(() => favoriteArtifacts.map(artifact => ({
        ...artifact,
        favorite: true,
        repository: repos?.find(r => r.id === artifact.repositoryId)
    })), [repos, favoriteArtifacts]);

    const startIndex = PAGE_SIZE * currentPage;
    const endIndex = Math.min(files.length, startIndex + PAGE_SIZE);
    const pageFiles = files.slice(startIndex, endIndex);

    return (
        <>
            <FileList
                files={pageFiles}
                fallback="favorites.notAvailable"
                onFavorite={console.log}
                onClick={console.log}
                onMenuClick={console.log}
                menuEntries={FAVORITE_OPTIONS} />
            <Pagination
                currentPage={currentPage}
                itemsPerPage={PAGE_SIZE}
                totalItems={files.length}
                onPage={setCurrentPage} />
        </>
    );
});

export default FavoriteArtifacts;
