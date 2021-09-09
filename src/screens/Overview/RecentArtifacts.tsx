import { observer } from "mobx-react";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactTO, RepositoryTO } from "../../api";
import ArtifactEntry from "../../components/Artifact/ArtifactEntry";
import Section from "../../components/Layout/Section";
import { RECENT_ARTIFACTS, SYNC_STATUS_RECENT } from "../../constants/Constants";
import { fetchRecentArtifacts } from "../../store/actions";
import { RootState } from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";

const RecentArtifacts: React.FC = observer(() => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const recentArtifacts: ArtifactTO[] = useSelector((state: RootState) => state.artifacts.recentArtifacts);
    const repos: RepositoryTO[] = useSelector((state: RootState) => state.repos.repos);
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.recentSynced);
    const favoriteArtifacts: ArtifactTO[] = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);

    const fetchRecent = useCallback(() => {
        fetchRecentArtifacts().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: RECENT_ARTIFACTS, recentArtifacts: response.data });
                dispatch({ type: SYNC_STATUS_RECENT, dataSynced: true })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchRecent())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchRecent())
        })
    }, [dispatch, t]);

    useEffect(() => {
        if (!syncStatus) {
            fetchRecent();
        }
    }, [fetchRecent, syncStatus]);

    return (
        <Section title="category.recent">
            {recentArtifacts?.map(artifact => (
                <ArtifactEntry
                    artifact={artifact}
                    favorite={helpers.isFavorite(artifact.id, favoriteArtifacts?.map(artifact => artifact.id))}
                    repository={helpers.getRepoName(artifact.repositoryId, repos)} />
            ))}
            {recentArtifacts?.length === 0 && (
                <span>{t("category.recent")}</span>
            )}
        </Section>
    );
});

export default RecentArtifacts;
