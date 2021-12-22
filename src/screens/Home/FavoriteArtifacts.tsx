import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, RepositoryTO} from "../../api";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import Section from "../../components/Layout/Section";
import {FAVORITE_ARTIFACTS, SYNC_STATUS_FAVORITE} from "../../constants/Constants";
import {fetchFavoriteArtifacts} from "../../store/actions";
import {RootState} from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import OverviewArtifactList from "./OverviewArtifactList";

const FavoriteArtifacts: React.FC = observer(() => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.favoriteSynced);

    const fetchFavorite = useCallback(() => {
        fetchFavoriteArtifacts().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: FAVORITE_ARTIFACTS, favoriteArtifacts: response.data });
                dispatch({ type: SYNC_STATUS_FAVORITE, dataSynced: true })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchFavorite())
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchFavorite())
        })

    }, [dispatch, t]);

    useEffect(() => {
        if (!syncStatus) {
            fetchFavorite();
        }
    }, [syncStatus, fetchFavorite])


    return (
        <Section title="category.favorite" key={"favorite"}>
            <ErrorBoundary>
                <OverviewArtifactList
                    artifacts={favoriteArtifacts}
                    repositories={repos}
                    favorites={favoriteArtifacts} />
            </ErrorBoundary>
        </Section>
    );
});

export default FavoriteArtifacts;
