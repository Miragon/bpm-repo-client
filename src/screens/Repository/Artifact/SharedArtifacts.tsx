import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { ArtifactTO, RepositoryTO } from "../../../api";
import { ErrorBoundary } from "../../../components/Exception/ErrorBoundary";
import Section from "../../../components/Layout/Section";
import { SHARED_ARTIFACTS } from "../../../constants/Constants";
import { getSharedArtifacts } from "../../../store/actions/shareAction";
import { RootState } from "../../../store/reducers/rootReducer";
import helpers from "../../../util/helperFunctions";
import RepositoryArtifactList from "../RepositoryArtifactList";

const SharedArtifacts: React.FC = (() => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const { repoId } = useParams<{ repoId: string }>();
    const sharedArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.sharedArtifacts);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);

    const getShared = useCallback(async (repoId: string) => {
        getSharedArtifacts(repoId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: SHARED_ARTIFACTS, sharedArtifacts: response.data })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getShared(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getShared(repoId))
        })
    }, [dispatch, t])

    useEffect(() => {
        getShared(repoId)
    }, [getShared, repoId])

    return (
        <Section title="category.shared">
            <ErrorBoundary>
                <RepositoryArtifactList
                    artifacts={sharedArtifacts}
                    repositories={repos}
                    fallback="share.na"
                    favorites={favoriteArtifacts} />
            </ErrorBoundary>
        </Section>
    );
});
export default SharedArtifacts;
