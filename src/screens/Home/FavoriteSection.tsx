import { makeStyles } from "@material-ui/core/styles";
import {
    CloudDownloadOutlined,
    DeleteOutlineOutlined,
    EditOutlined,
    FolderOutlined
} from "@material-ui/icons";
import { observer } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileList from "../../components/Layout/Files/FileList";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import Pagination from "../../components/Layout/List/Pagination";
import { loadFavoriteArtifacts } from "../../store/FavoriteArtifactState";
import { RootState } from "../../store/reducers/rootReducer";
import { loadRepositories } from "../../store/RepositoryState";
import { usePagination } from "../../util/hooks/usePagination";


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
];

const useStyles = makeStyles({
    fileList: {
        marginBottom: "1rem"
    }
});

const FavoriteArtifacts: React.FC = observer(() => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const repositories = useSelector((state: RootState) => state.repositories);
    const favoriteArtifacts = useSelector((state: RootState) => state.favoriteArtifacts);

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadFavoriteArtifacts());
    }, [dispatch]);

    const files: FileDescription[] = useMemo(() => (favoriteArtifacts.value || []).map(artifact => ({
        ...artifact,
        favorite: true,
        repository: repositories.value?.find(r => r.id === artifact.repositoryId)
    })), [repositories, favoriteArtifacts]);

    const { pageItems, paginationConfig } = usePagination(files, 5);

    return (
        <>
            <FileList
                files={pageItems}
                className={classes.fileList}
                fallback="favorites.notAvailable"
                onFavorite={console.log}
                onClick={console.log}
                onMenuClick={console.log}
                menuEntries={FAVORITE_OPTIONS} />
            <Pagination config={paginationConfig} />
        </>
    );
});

export default FavoriteArtifacts;
