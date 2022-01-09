import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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
import { openRepository } from "../../util/LinkUtils";
import { getAddOptions } from "../../util/MenuUtils";
import CreateArtifactDialog from "../Common/Dialogs/CreateArtifactDialog";
import CreateRepositoryDialog from "../Common/Dialogs/CreateRepositoryDialog";
import UploadArtifactDialog from "../Common/Dialogs/UploadArtifactDialog";
import ArtifactFavoriteSection from "../Common/Sections/ArtifactFavoriteSection";
import ArtifactSearchSection from "../Common/Sections/ArtifactSearchSection";

const FavoriteScreen: React.FC = (() => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { t } = useTranslation("common");

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);

    const [loadKey, setLoadKey] = useState(0);
    const [search, setSearch] = useState("");
    const [uploadArtifactDialogOpen, setUploadArtifactDialogOpen] = useState(false);
    const [createRepositoryDialogOpen, setCreateRepositoryDialogOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("");

    const addOptions: MenuListConfig = useMemo(
        () => getAddOptions(artifactTypes.value || [], true),
        [artifactTypes]
    );

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadArtifactTypes());
    }, [dispatch]);

    useEffect(() => {
        if (loadKey > 0) {
            dispatch(loadRepositories());
            dispatch(loadArtifactTypes());
        }
    }, [dispatch, loadKey]);

    const onAddItemClicked = useCallback((action: string) => {
        switch (action) {
            case "create-repository": {
                setCreateRepositoryDialogOpen(true);
                break;
            }
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

    const reload = useCallback(() => setLoadKey(cur => cur + 1), []);

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

    return (
        <>
            <ErrorBoundary>
                <ScreenHeader
                    onSearch={setSearch}
                    onAdd={onAddItemClicked}
                    title={[{ title: t("breadcrumbs.allFavorites"), link: "/favorites" }]}
                    addOptions={addOptions}
                    primary="add" />
            </ErrorBoundary>

            <ContentLayout>
                <ErrorBoundary>
                    <ArtifactFavoriteSection
                        pageSize={18}
                        hideWhenNoneFound={false}
                        loadKey={loadKey}
                        onChange={reload}
                        search={search} />
                </ErrorBoundary>
                {search && (
                    <ErrorBoundary>
                        <ArtifactSearchSection
                            loadKey={loadKey}
                            onChange={reload}
                            search={search} />
                    </ErrorBoundary>
                )}
            </ContentLayout>

            <ErrorBoundary>
                <CreateRepositoryDialog
                    open={createRepositoryDialogOpen}
                    onClose={repositoryId => {
                        setCreateRepositoryDialogOpen(false);
                        repositoryId && history.push(openRepository(repositoryId));
                    }} />

                <CreateArtifactDialog
                    repositories={repositories.value || []}
                    open={!!createArtifactType}
                    type={createArtifactType}
                    onClose={result => {
                        setCreateArtifactType("");
                        result && reload();
                    }} />

                <UploadArtifactDialog
                    open={uploadArtifactDialogOpen}
                    onClose={result => {
                        setUploadArtifactDialogOpen(false);
                        result && reload();
                    }}
                    repositories={repositories.value || []}
                    artifactTypes={artifactTypes.value || []} />
            </ErrorBoundary>
        </>
    );
});

export default FavoriteScreen;
