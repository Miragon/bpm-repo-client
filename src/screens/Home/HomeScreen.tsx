import {
    CloudUploadOutlined,
    CreateNewFolderOutlined,
    FormatShapesOutlined,
    NoteAddOutlined,
    RepeatOutlined,
    TuneOutlined
} from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "../../components/Exception/ErrorBoundary";
import ScreenHeader from "../../components/Layout/Header/ScreenHeader";
import ScreenSectionHeader from "../../components/Layout/Header/ScreenSectionHeader";
import { CrumbElement } from "../../components/Layout/PathStructure";
import { SYNC_STATUS_ARTIFACT, SYNC_STATUS_FAVORITE } from "../../constants/Constants";
import FavoriteSection from "./FavoriteSection";
import RecentArtifacts from "./RecentArtifacts";
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
        },
        {
            label: "artifact.import",
            value: "import-file",
            icon: RepeatOutlined
        }
    ]
]

const HomeScreen: React.FC = (() => {
    const history = useHistory();
    const dispatch = useDispatch();

    const path: Array<CrumbElement> = [{
        name: "path.overview",
        onClick: () => {
            dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false })
            dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: false })
            history.push("/")
        }
    }];

    return (
        <>
            <ScreenHeader
                onSearch={console.log}
                onAdd={console.log}
                onFavorite={console.log}
                title="Modellverwaltung"
                addOptions={ADD_OPTIONS}
                isFavorite={false}
                primary="add" />

            <ErrorBoundary>
                <ScreenSectionHeader title="Alle Repositories" />
                <RepositorySection />
            </ErrorBoundary>

            <ErrorBoundary>
                <ScreenSectionHeader title="Favoriten" />
                <FavoriteSection />
            </ErrorBoundary>

            <ErrorBoundary>
                <RecentArtifacts />
            </ErrorBoundary>
        </>
    );
});

export default HomeScreen;
