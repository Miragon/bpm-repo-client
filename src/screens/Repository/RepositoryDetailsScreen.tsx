import { DeleteOutlineOutlined, PeopleAltOutlined, SettingsOutlined } from "@material-ui/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "../../components/Exception/ErrorBoundary";
import { PopupToast, retryAction } from "../../components/Form/PopupToast";
import ScreenHeader from "../../components/Header/ScreenHeader";
import ContentLayout from "../../components/Layout/ContentLayout";
import { MenuListConfig } from "../../components/MenuList/MenuList";
import { loadArtifactTypes } from "../../store/ArtifactTypeState";
import { loadRepositories } from "../../store/RepositoryState";
import { RootState } from "../../store/Store";
import { getAddOptions } from "../../util/MenuUtils";
import WrapperCreateArtifactDialog from "../Common/Dialogs/artifacts/WrapperCreateArtifactDialog";
import DeleteRepositoryDialog from "../Common/Dialogs/DeleteRepositoryDialog";
import EditRepositoryDialog from "../Common/Dialogs/EditRepositoryDialog";
import RepositoryMembersDialog from "../Common/Dialogs/RepositoryMembersDialog";
import WrapperUploadArtifactDialog from "../Common/Dialogs/artifacts/WrapperUploadArtifactDialog";
import RepositoryDeploymentSection from "../Common/Sections/RepositoryDeploymentSection";
import RepositoryFilesSection from "../Common/Sections/RepositoryFilesSection";
import RepositorySharedSection from "../Common/Sections/RepositorySharedSection";

const MENU_OPTIONS = [
    [
        {
            label: "repository.members.manage",
            value: "members",
            icon: PeopleAltOutlined
        },
        {
            label: "repository.settings",
            value: "settings",
            icon: SettingsOutlined
        }
    ],
    [
        {
            label: "repository.delete",
            value: "delete",
            icon: DeleteOutlineOutlined
        }
    ]
];

interface Params {
    repositoryId: string;
}

const RepositoryDetailsScreen: React.FC = (() => {
    const history = useHistory();
    const dispatch = useDispatch();
    const params = useParams<Params>();

    const { t } = useTranslation("common");

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);

    const [memberDialogOpen, setMemberDialogOpen] = useState(false);
    const [deleteRepositoryDialogOpen, setDeleteRepositoryDialogOpen] = useState(false);
    const [editRepositoryDialogOpen, setEditRepositoryDialogOpen] = useState(false);
    const [loadKey, setLoadKey] = useState(0);
    const [search, setSearch] = useState("");
    const [uploadArtifactDialogOpen, setUploadArtifactDialogOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("");

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadArtifactTypes());
    }, [dispatch]);

    useEffect(() => {
        if (loadKey > 0) {
            dispatch(loadRepositories(true));
            dispatch(loadArtifactTypes(true));
        }
    }, [dispatch, loadKey]);

    const addOptions: MenuListConfig = useMemo(
        () => getAddOptions(artifactTypes.value || [], false),
        [artifactTypes]
    );

    const onAddItemClicked = useCallback((action: string) => {
        switch (action) {
            case "upload-file": {
                setUploadArtifactDialogOpen(true);
                break;
            }
            default: {
                if (action.startsWith("create-file-")) {
                    setCreateArtifactType(action.substring(12));
                }
                break;
            }
        }
    }, []);

    const onMenuItemClicked = useCallback((action: string) => {
        switch (action) {
            case "members": {
                setMemberDialogOpen(true);
                break;
            }
            case "settings": {
                setEditRepositoryDialogOpen(true);
                break;
            }
            case "delete": {
                setDeleteRepositoryDialogOpen(true);
                break;
            }
        }
    }, []);

    const reload = useCallback(() => setLoadKey(cur => cur + 1), []);

    const repository = repositories.value?.find(r => r.id === params.repositoryId);

    if (repositories.error || artifactTypes.error) {
        return (
            <PopupToast
                message={t("exception.loadingError")}
                action={retryAction(() => {
                    repositories.error && dispatch(loadRepositories(true));
                    artifactTypes.error && dispatch(loadArtifactTypes(true));
                })} />
        );
    }

    if (repositories.value && !repository) {
        return (
            <PopupToast message={t("exception.repositoryNotFound")} />
        );
    }

    return (
        <>
            <ErrorBoundary>
                <ScreenHeader
                    onSearch={setSearch}
                    onAdd={onAddItemClicked}
                    onMenu={onMenuItemClicked}
                    title={[
                        { title: t("breadcrumbs.allRepositories"), link: "/repository" },
                        {
                            title: repository?.name ?? t("breadcrumbs.unknown"),
                            link: "/repository/" + repository?.id
                        }
                    ]}
                    addOptions={addOptions}
                    menuOptions={MENU_OPTIONS}
                    primary="add" />
            </ErrorBoundary>

            <ContentLayout>
                <ErrorBoundary>
                    <RepositoryFilesSection
                        search={search}
                        loadKey={loadKey}
                        onChange={reload}
                        repositoryId={params.repositoryId} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <RepositorySharedSection
                        search={search}
                        loadKey={loadKey}
                        onChange={reload}
                        repositoryId={params.repositoryId} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <RepositoryDeploymentSection
                        search={search}
                        loadKey={loadKey}
                        onChange={reload}
                        repositoryId={params.repositoryId} />
                </ErrorBoundary>
            </ContentLayout>

            <ErrorBoundary>
                <WrapperCreateArtifactDialog
                    repositoryId={params.repositoryId}
                    repositories={repositories.value || []}
                    open={!!createArtifactType}
                    types={artifactTypes.value || []}
                    type={createArtifactType}
                    onClose={result => {
                        setCreateArtifactType("");
                        result && reload();
                    }} />

                <WrapperUploadArtifactDialog
                    open={uploadArtifactDialogOpen}
                    repositoryId={params.repositoryId}
                    onClose={result => {
                        setUploadArtifactDialogOpen(false);
                        result && reload();
                    }}
                    repositories={repositories.value || []}
                    artifactTypes={artifactTypes.value || []} />

                <EditRepositoryDialog
                    open={editRepositoryDialogOpen}
                    repository={repository}
                    onClose={() => setEditRepositoryDialogOpen(false)} />

                <DeleteRepositoryDialog
                    open={deleteRepositoryDialogOpen}
                    repository={repository}
                    onClose={deleted => {
                        setDeleteRepositoryDialogOpen(false);
                        deleted && history.push("/");
                    }} />

                <RepositoryMembersDialog
                    open={memberDialogOpen}
                    repository={repository}
                    onClose={() => {
                        setMemberDialogOpen(false);
                        reload();
                    }} />

            </ErrorBoundary>
        </>
    );
});

export default RepositoryDetailsScreen;
