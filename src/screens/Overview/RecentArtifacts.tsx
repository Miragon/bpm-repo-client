import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, RepositoryTO} from "../../api";
import Section from "../../components/Layout/Section";
import {RECENT_ARTIFACTS, SYNC_STATUS_ARTIFACT} from "../../constants/Constants";
import {fetchRecentArtifacts} from "../../store/actions";
import {RootState} from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import OverviewArtifactList from "./OverviewArtifactList";

const RecentArtifacts: React.FC = (() => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const [recentArtifacts, setRecentArtifacts] = useState<Array<ArtifactTO>>([])

    const repos: RepositoryTO[] = useSelector((state: RootState) => state.repos.repos);
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.artifactSynced);
    const favoriteArtifacts: ArtifactTO[] = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);

    const fetchRecent = useCallback(() => {
        fetchRecentArtifacts().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setRecentArtifacts(response.data)
                dispatch({ type: RECENT_ARTIFACTS, recentArtifacts: response.data });
                dispatch({ type: SYNC_STATUS_ARTIFACT, dataSynced: true })
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
            <OverviewArtifactList
                artifacts={recentArtifacts}
                repositories={repos}
                favorites={favoriteArtifacts} />
        </Section>
    );
});

export default RecentArtifacts;
