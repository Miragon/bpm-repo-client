import {
    CloudUploadOutlined,
    CreateNewFolderOutlined,
    FormatShapesOutlined,
    NoteAddOutlined,
    TuneOutlined
} from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "../../components/Exception/ErrorBoundary";
import ScreenHeader from "../../components/Header/ScreenHeader";
import ContentLayout from "../../components/Layout/ContentLayout";
import { loadArtifactTypes } from "../../store/ArtifactTypeState";
import { loadRepositories } from "../../store/RepositoryState";
import { RootState } from "../../store/Store";
import { openRepository } from "../../util/LinkUtils";
import CreateArtifactDialog from "../Common/Dialogs/CreateArtifactDialog";
import CreateRepositoryDialog from "../Common/Dialogs/CreateRepositoryDialog";
import UploadArtifactDialog from "../Common/Dialogs/UploadArtifactDialog";
import ArtifactFavoriteSection from "../Common/Sections/ArtifactFavoriteSection";
import ArtifactRecentSection from "../Common/Sections/ArtifactRecentSection";
import ArtifactSearchSection from "../Common/Sections/ArtifactSearchSection";
import RepositorySection from "../Common/Sections/RepositorySection";

const ADD_OPTIONS = [
    [
        {
            label: "repository.create",
            value: "create-repository",
            icon: CreateNewFolderOutlined
        }
    ],
    [
        {
            label: "artifact.createBPMN",
            value: "create-bpmn",
            icon: NoteAddOutlined
        },
        {
            label: "artifact.createDMN",
            value: "create-dmn",
            icon: NoteAddOutlined
        },
        {
            label: "artifact.createFORM",
            value: "create-form",
            icon: FormatShapesOutlined
        },
        {
            label: "artifact.createCONFIGURATION",
            value: "create-configuration",
            icon: TuneOutlined
        }
    ],
    [
        {
            label: "artifact.upload",
            value: "upload-file",
            icon: CloudUploadOutlined
        }
    ]
]

const HomeScreen: React.FC = (() => {
    const history = useHistory();
    const dispatch = useDispatch();

    const repositories = useSelector((state: RootState) => state.repositories);
    const artifactTypes = useSelector((state: RootState) => state.artifactTypes);

    const [loadKey, setLoadKey] = useState(0);
    const [search, setSearch] = useState("");
    const [uploadArtifactDialogOpen, setUploadArtifactDialogOpen] = useState(false);
    const [createRepositoryDialogOpen, setCreateRepositoryDialogOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("");

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
            case "create-bpmn": {
                setCreateArtifactType("BPMN");
                break;
            }
            case "create-dmn": {
                setCreateArtifactType("DMN");
                break;
            }
            case "create-form": {
                setCreateArtifactType("FORM");
                break;
            }
            case "create-configuration": {
                setCreateArtifactType("CONFIGURATION");
                break;
            }
            case "upload-file": {
                setUploadArtifactDialogOpen(true);
                break;
            }
        }
    }, []);

    const reload = useCallback(() => setLoadKey(cur => cur + 1), []);

    return (
        <>
            <ErrorBoundary>
                <ScreenHeader
                    onSearch={setSearch}
                    onAdd={onAddItemClicked}
                    title={[{ title: "Modellverwaltung", link: "/" }]}
                    addOptions={ADD_OPTIONS}
                    primary="add" />
            </ErrorBoundary>

            <ContentLayout>
                <ErrorBoundary>
                    <RepositorySection
                        loadKey={loadKey}
                        onChange={reload}
                        search={search} />
                </ErrorBoundary>

                <ErrorBoundary>
                    <ArtifactFavoriteSection
                        loadKey={loadKey}
                        onChange={reload}
                        search={search} />
                </ErrorBoundary>

                <ErrorBoundary>
                    <ArtifactRecentSection
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
                        if (result) {
                            reload();
                            history.push(openRepository(result.repositoryId));
                        }
                    }} />

                <UploadArtifactDialog
                    open={uploadArtifactDialogOpen}
                    onClose={result => {
                        setUploadArtifactDialogOpen(false);
                        if (result) {
                            reload();
                            history.push(openRepository(result.repositoryId));
                        }
                    }}
                    repositories={repositories.value || []}
                    artifactTypes={artifactTypes.value || []} />
            </ErrorBoundary>
        </>
    );
});

export default HomeScreen;
