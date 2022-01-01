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
import ContentLayout from "../../components/Layout/ContentLayout";
import ScreenHeader from "../../components/Layout/Header/ScreenHeader";
import ScreenSectionHeader from "../../components/Layout/Header/ScreenSectionHeader";
import { loadArtifactTypes } from "../../store/ArtifactTypeState";
import { loadRecentArtifacts } from "../../store/RecentArtifactState";
import { loadRepositories } from "../../store/RepositoryState";
import { RootState } from "../../store/Store";
import CreateArtifactDialog from "../Common/CreateArtifactDialog";
import CreateRepositoryDialog from "../Common/CreateRepositoryDialog";
import UploadArtifactDialog from "../Common/UploadArtifactDialog";
import FavoriteSection from "./FavoriteSection";
import RecentSection from "./RecentSection";
import RepositorySection from "./RepositorySection";

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

    const [uploadArtifactDialogOpen, setUploadArtifactDialogOpen] = useState(false);
    const [createRepositoryDialogOpen, setCreateRepositoryDialogOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("");

    useEffect(() => {
        dispatch(loadRepositories());
        dispatch(loadArtifactTypes());
    }, [dispatch]);

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

    return (
        <>
            <ErrorBoundary>
                <ScreenHeader
                    onSearch={console.log}
                    onAdd={onAddItemClicked}
                    onFavorite={console.log}
                    showFavorite={false}
                    title="Modellverwaltung"
                    addOptions={ADD_OPTIONS}
                    isFavorite={false}
                    primary="add" />
            </ErrorBoundary>

            <ContentLayout>
                <ErrorBoundary>
                    <ScreenSectionHeader title="Alle Repositories" />
                    <RepositorySection />
                </ErrorBoundary>

                <ErrorBoundary>
                    <ScreenSectionHeader title="Favoriten" />
                    <FavoriteSection />
                </ErrorBoundary>

                <ErrorBoundary>
                    <ScreenSectionHeader title="Zuletzt bearbeitet" />
                    <RecentSection />
                </ErrorBoundary>
            </ContentLayout>

            <ErrorBoundary>
                <CreateRepositoryDialog
                    open={createRepositoryDialogOpen}
                    onClose={repositoryId => {
                        setCreateRepositoryDialogOpen(false);
                        repositoryId && history.push("/repository/" + repositoryId);
                    }} />

                <CreateArtifactDialog
                    repositories={repositories.value || []}
                    open={!!createArtifactType}
                    type={createArtifactType}
                    onClose={result => {
                        setCreateArtifactType("");
                        result && history.push(`/repository/${result.repositoryId}/${result.artifactId}`);
                    }} />

                <UploadArtifactDialog
                    open={uploadArtifactDialogOpen}
                    onClose={result => {
                        setUploadArtifactDialogOpen(false);
                        if (result) {
                            history.push(`/repository/${result.repositoryId}/${result.artifactId}/milestone/${result.milestone}`);
                            // Update state
                            dispatch(loadRepositories(true));
                            dispatch(loadRecentArtifacts(true));
                        }
                    }}
                    repositories={repositories.value || []}
                    artifactTypes={artifactTypes.value || []} />
            </ErrorBoundary>
        </>
    );
});

export default HomeScreen;
