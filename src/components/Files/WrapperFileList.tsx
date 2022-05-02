import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ArtifactApi, ArtifactTypeTO, MilestoneApi, RepositoryTO } from "../../api";
import { loadFavoriteArtifacts } from "../../store/FavoriteArtifactState";
import { apiExec, hasFailed } from "../../util/ApiUtils";
import { downloadFile } from "../../util/FileUtils";
import { openFileInTool, openRepository } from "../../util/LinkUtils";
import { makeErrorToast, makeSuccessToast } from "../../util/ToastUtils";
import { usePagination } from "../List/usePagination";
import { FileDescription } from "./FileListEntry";
import { MenuListConfig } from "../MenuList/MenuList";
import WrapperEditArtifactDialog from "../../screens/Common/Dialogs/artifacts/WrapperEditArtifactDialog";
import DeleteArtifactDialog from "../../screens/Common/Dialogs/DeleteArtifactDialog";
import FileList from "./FileList";
import WrapperCopyArtifactDialog from "../../screens/Common/Dialogs/artifacts/WrapperCopyArtifactDialog";
import ShareArtifactDialog from "../../screens/Common/Dialogs/ShareArtifactDialog";
import CreateMilestoneDialog from "../../screens/Common/Dialogs/CreateMilestoneDialog";
import ListMilestonesDialog from "../../screens/Common/Dialogs/ListMilestonesDialog";
import CustomPagination from "../List/CustomPagination";


interface Props {
    files: FileDescription[];
    fallback: string;
    className?: string;
    pageSize?: number;
    reloadFiles: () => void;
    artifactTypes: ArtifactTypeTO[];
    menuEntries: MenuListConfig;
    repositories?: RepositoryTO[];
    ownRepositories?: RepositoryTO[];
    targets?: string[];
    paginationClassName?: string;
}

const WrapperFileList: React.FC<Props> = props => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { t } = useTranslation("common");

    const [editArtifact, setEditArtifact] = useState<FileDescription>();
    const [deleteArtifact, setDeleteArtifact] = useState<FileDescription>();
    const [createMilestoneArtifact, setCreateMilestoneArtifact] = useState<FileDescription>();
    const [listMilestonesArtifact, setListMilestonesArtifact] = useState<FileDescription>();
    const [shareArtifact, setShareArtifact] = useState<FileDescription>();
    const [copyArtifact, setCopyArtifact] = useState<FileDescription>();

    const { pageItems, paginationConfig } = usePagination(props.files, props.pageSize ?? 10);

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
    }, [history, props.artifactTypes, t]);

    const openFile = useCallback(file => {
        const openedFile = openFileInTool(props.artifactTypes, file.fileType, file.repository.id, file.id);
        // if file is not opened in editor show an upload dialog
        if (!openedFile) {
            setEditArtifact(file);
        }
    }, [props.artifactTypes]);

    return (
        <>
            <FileList
                files={pageItems}
                className={props.className}
                fallback={props.fallback}
                onFavorite={onFavoriteClicked}
                onClick={file => file.repository && openFile(file)}
                onMenuClick={onMenuEntryClicked}
                menuEntries={props.menuEntries} />
            <CustomPagination className={props.paginationClassName} config={paginationConfig} />
            {editArtifact &&
                <WrapperEditArtifactDialog
                    onClose={saved => {
                        setEditArtifact(undefined);
                        saved && props.reloadFiles();
                    }}
                    open={!!editArtifact}
                    artifact={editArtifact} />
            }
            <DeleteArtifactDialog
                onClose={deleted => {
                    setDeleteArtifact(undefined);
                    deleted && props.reloadFiles();
                }}
                open={!!deleteArtifact}
                artifact={deleteArtifact} />
            {props.repositories &&
                <WrapperCopyArtifactDialog
                    open={ !!copyArtifact }
                    onClose={ () => setCopyArtifact(undefined) }
                    artifact={ copyArtifact }
                    repositories={ props.repositories } />
            }
            {props.ownRepositories &&
                <ShareArtifactDialog
                    open={ !!shareArtifact }
                    artifact={ shareArtifact }
                    ownRepositories={ props.ownRepositories }
                    onClose={ () => setShareArtifact(undefined) } />
            }
            <CreateMilestoneDialog
                open={ !!createMilestoneArtifact }
                artifact={ createMilestoneArtifact }
                onClose={ () => setCreateMilestoneArtifact(undefined) } />

            {props.targets &&
                <ListMilestonesDialog
                    artifactTypes={props.artifactTypes}
                    targets={props.targets}
                    onChanged={props.reloadFiles}
                    open={!!listMilestonesArtifact}
                    artifact={listMilestonesArtifact}
                    onClose={() => setListMilestonesArtifact(undefined)} />
            }
        </>
    );
};

export default WrapperFileList;
