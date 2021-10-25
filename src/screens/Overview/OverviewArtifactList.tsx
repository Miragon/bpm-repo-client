import React, {useCallback, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {ArtifactTO, RepositoryTO} from "../../api";
import ArtifactEntry from "../../components/Artifact/ArtifactEntry";
import {SYNC_STATUS_ARTIFACT, SYNC_STATUS_FAVORITE} from "../../constants/Constants";
import {addToFavorites, deleteArtifact, getLatestMilestone} from "../../store/actions";
import helpers from "../../util/helperFunctions";
import {DropdownButtonItem} from "../../components/Shared/Form/DropdownButton";
import PopupSettings from "../../components/Shared/Form/PopupSettings";
import EditArtifactDialog from "../../components/Artifact/Dialogs/EditArtifactDialog";

interface Props {
    artifacts: ArtifactTO[];
    repositories: RepositoryTO[];
    favorites: ArtifactTO[];
    fallback?: string;
}

const OverviewArtifactList: React.FC<Props> = (props: Props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation("common");

    const {
        fallback,
        favorites,
        repositories,
        artifacts
    } = props;

    const [editArtifact, setEditArtifact] = useState<ArtifactTO>();
    const [menu, setMenu] = useState<{
        target: Element;
        artifact: ArtifactTO;
        isFavorite: boolean;
        repository: string;
    }>();

    const onFavorite = useCallback(async (artifact: ArtifactTO) => {
        addToFavorites(artifact.id).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: false });
                dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: false });
            } else {
                helpers.makeErrorToast(t("artifact.couldNotSetStarred"), () => onFavorite(artifact))
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onFavorite(artifact))
        })
    }, [dispatch, t]);

    const onDownload = useCallback(async (artifact: ArtifactTO) => {
        getLatestMilestone(artifact.id).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                helpers.download(response.data)
                helpers.makeSuccessToast(t("download.started"))
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => onDownload(artifact))
            }

        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onDownload(artifact))
        })
    }, [t]);

    const onDelete = useCallback(async (artifact: ArtifactTO) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm(t("artifact.confirmDelete", { artifactName: artifact.name }))) {
            deleteArtifact(artifact.id).then(response => {
                if (Math.floor(response.status / 100) === 2) {
                    helpers.makeSuccessToast(t("artifact.deleted"));
                    dispatch({type: SYNC_STATUS_ARTIFACT, dataSynced: false})
                } else {
                    helpers.makeErrorToast(t(response.statusText), () => onDelete(artifact));
                }
            }, error => {
                helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onDelete(artifact))
            })
        }
    }, [dispatch, t]);

    const onShow = useCallback((artifact: ArtifactTO) => {
        history.push(`/repository/${artifact.repositoryId}`);
    }, [history]);

    const onEdit = useCallback((artifact: ArtifactTO) => {
        setEditArtifact(artifact);
    }, []);

    const options: DropdownButtonItem[] = useMemo(() => [
        {
            id: "ShowInRepo",
            label: t("artifact.showInRepo"),
            type: "button",
            onClick: () => menu && onShow(menu.artifact)
        },
        {
            id: "EditArtifact",
            label: t("artifact.edit"),
            type: "button",
            onClick: () => menu && onEdit(menu?.artifact)
        },
        {
            id: "DownloadArtifact",
            label: t("artifact.download"),
            type: "button",
            onClick: () => menu && onDownload(menu.artifact)
        },
        {
            id: "divider1",
            type: "divider",
            label: ""
        },
        {
            id: "DeleteArtifact",
            label: t("artifact.delete"),
            type: "button",
            onClick: () => menu && onDelete(menu.artifact)
        }
    ], [menu, onDelete, onDownload, onEdit, onShow, t]);

    return (
        <div>
            <div>
                {artifacts?.map(artifact => (
                    <ArtifactEntry
                        key={artifact.id}
                        artifact={artifact}
                        onMenuClicked={setMenu}
                        onFavorite={onFavorite}
                        favorite={helpers.isFavorite(artifact.id, favorites.map(artifact => artifact.id))}
                        repository={helpers.getRepoName(artifact.repositoryId, repositories)} />
                ))}
                {artifacts.length === 0 && (
                    <span>{t(fallback ?? "category.noFavoritesAvailable")}</span>
                )}
            </div>

            <PopupSettings
                open={!!menu}
                reference={menu?.target || null}
                onCancel={() => setMenu(cur => cur?.artifact === menu?.artifact ? undefined : cur)}
                options={options} />

            <EditArtifactDialog
                open={!!editArtifact}
                onCancelled={() => setEditArtifact(undefined)}
                artifact={editArtifact} />
        </div>
    );
};

export default OverviewArtifactList;
