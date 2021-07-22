import {makeStyles} from "@material-ui/styles";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO} from "../../../api/models";
import {fetchArtifactsFromRepo} from "../../../store/actions";
import {RootState} from "../../../store/reducers/rootReducer";
import ArtifactListItem from "./ArtifactListItem";
import {useParams} from "react-router";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap"
    },
    unstyledButton: {
        all: "unset"
    }
}));

const ArtifactDetails: React.FC = (() => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { repoId } = useParams<{ repoId: string }>();
    const activeArtifacts: Array<ArtifactTO> = useSelector(
        (state: RootState) => state.artifacts.artifacts
    );
    const synced = useSelector((state: RootState) => state.dataSynced.artifactSynced);

    const fetchActiveArtifacts = useCallback((repoId: string) => {
        try {
            dispatch(fetchArtifactsFromRepo(repoId));

        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!synced) {
            fetchActiveArtifacts(repoId);
        }

    }, [synced, fetchActiveArtifacts, repoId]);

    return (
        <>
            <div className={classes.container}>
                {activeArtifacts?.map(artifact => (
                    <ArtifactListItem
                        key={artifact.id}
                        artifactTitle={artifact.name}
                        image={artifact.svgPreview}
                        updatedDate={artifact.updatedDate}
                        createdDate={artifact.createdDate}
                        description={artifact.description}
                        repoId={artifact.repositoryId}
                        artifactId={artifact.id}
                        fileType={artifact.fileType} />
                ))}
            </div>
        </>
    );
});
export default ArtifactDetails;
