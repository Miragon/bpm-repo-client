import {
    CloudUploadOutlined,
    CreateNewFolderOutlined,
    FormatShapesOutlined,
    NoteAddOutlined,
    RepeatOutlined,
    TuneOutlined
} from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "../../components/Exception/ErrorBoundary";
import ContentLayout from "../../components/Layout/ContentLayout";
import ScreenHeader from "../../components/Layout/Header/ScreenHeader";
import ScreenSectionHeader from "../../components/Layout/Header/ScreenSectionHeader";
import { CrumbElement } from "../../components/Layout/PathStructure";
import CreateTitleDescDialog from "../../components/Shared/Dialogs/CreateTitleDescDialog";
import {
    SYNC_STATUS_ARTIFACT,
    SYNC_STATUS_FAVORITE,
    SYNC_STATUS_REPOSITORY
} from "../../constants/Constants";
import { createRepository } from "../../store/actions";
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

    const { t } = useTranslation("common");

    const [createRepositoryDialogOpen, setCreateRepositoryDialogOpen] = useState(false);

    const onAddItemClicked = useCallback((action: string) => {
        switch (action) {
            case "create-repository": {
                setCreateRepositoryDialogOpen(true);
                break;
            }
        }
    }, []);

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
                onAdd={onAddItemClicked}
                onFavorite={console.log}
                title="Modellverwaltung"
                addOptions={ADD_OPTIONS}
                isFavorite={false}
                primary="add" />

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
                    <RecentArtifacts />
                </ErrorBoundary>
            </ContentLayout>

            <CreateTitleDescDialog
                open={createRepositoryDialogOpen}
                onCancelled={() => setCreateRepositoryDialogOpen(false)}
                successMessage={t("repository.created")}
                title={t("repository.create")}
                createMethod={createRepository}
                dataSyncedType={SYNC_STATUS_REPOSITORY} />
        </>
    );
});

export default HomeScreen;
