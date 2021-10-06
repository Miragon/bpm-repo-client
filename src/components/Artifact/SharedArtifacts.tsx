import React from "react";
import {useSelector} from "react-redux";
import {ArtifactTO, RepositoryTO} from "../../api";
import {RootState} from "../../store/reducers/rootReducer";
import Section from "../Layout/Section";
import {ErrorBoundary} from "../Exception/ErrorBoundary";
import ArtifactListWithMilestones from "./ArtifactListWithMilestones";


interface Props {
    sharedArtifacts: Array<ArtifactTO>;
}

const SharedArtifacts: React.FC<Props> = (props => {

    const sharedArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.sharedArtifacts);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);


    return (
        <Section title="category.shared">
            <ErrorBoundary>
                <ArtifactListWithMilestones
                    artifacts={sharedArtifacts}
                    repositories={repos}
                    fallback="share.na"
                    favorites={favoriteArtifacts} />
            </ErrorBoundary>
        </Section>
    );
});
export default SharedArtifacts;
