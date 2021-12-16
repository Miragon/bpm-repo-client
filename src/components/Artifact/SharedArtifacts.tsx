import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { ArtifactTO, RepositoryTO } from "../../api";
import { RootState } from "../../store/reducers/rootReducer";
import Section from "../Layout/Section";
import { ErrorBoundary } from "../Exception/ErrorBoundary";
import ArtifactListWithMilestones from "./ArtifactListWithMilestones";

interface Props {
    sharedArtifacts: Array<ArtifactTO>;
}

const SharedArtifacts: React.FC<Props> = () => {
    const { repoId } = useParams<{ repoId: string }>();
    const sharedArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.sharedArtifacts);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);

    return (
        <Section title="category.shared">
            <ErrorBoundary>
                <ArtifactListWithMilestones
                    repoId={repoId}
                    artifacts={sharedArtifacts}
                    repositories={repos}
                    fallback="share.na"
                    favorites={favoriteArtifacts} />
            </ErrorBoundary>
        </Section>
    );
};
export default SharedArtifacts;
