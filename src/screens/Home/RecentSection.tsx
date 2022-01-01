import { makeStyles } from "@material-ui/core/styles";
import {
    CloudDownloadOutlined,
    DeleteOutlineOutlined,
    EditOutlined,
    FolderOutlined
} from "@material-ui/icons";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileList from "../../components/Layout/Files/FileList";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import Pagination from "../../components/Layout/List/Pagination";
import { loadFavoriteArtifacts } from "../../store/FavoriteArtifactState";
import { loadRecentArtifacts } from "../../store/RecentArtifactState";
import { RootState } from "../../store/reducers/rootReducer";
import { loadRepositories } from "../../store/RepositoryState";
import { usePagination } from "../../util/hooks/usePagination";

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

const useStyles = makeStyles({
    fileList: {
        marginBottom: "1rem"
    }
});

const RecentArtifacts: React.FC = (() => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const repositories = useSelector((state: RootState) => state.repositories);
    const recentArtifacts = useSelector((state: RootState) => state.recentArtifacts);
    const favoriteArtifacts = useSelector((state: RootState) => state.favoriteArtifacts);

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadRecentArtifacts());
        dispatch(loadFavoriteArtifacts());
    }, [dispatch]);

    const files: FileDescription[] = useMemo(() => (recentArtifacts.value || []).map(artifact => ({
        ...artifact,
        favorite: !!favoriteArtifacts.value?.find(a => a.id === artifact.id),
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [recentArtifacts, repositories, favoriteArtifacts]);

    const { pageItems, paginationConfig } = usePagination(files, 5);

    return (
        <>
            <FileList
                files={pageItems}
                className={classes.fileList}
                fallback="recents.notAvailable"
                onFavorite={console.log}
                onClick={console.log}
                onMenuClick={console.log}
                menuEntries={RECENT_OPTIONS} />
            <Pagination config={paginationConfig} />
        </>
    );
});

export default RecentArtifacts;
