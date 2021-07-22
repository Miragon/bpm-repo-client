import {makeStyles} from "@material-ui/styles";
import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, RepositoryTO} from "../../api/models";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import * as artifactAction from "../../store/actions/artifactAction";
import {RootState} from "../../store/reducers/rootReducer";
import ArtifactCard from "./Holder/ArtifactCard";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    artifactContainer: {
        marginTop: "2rem",
        "&>h1": {
            color: "black",
            fontSize: "20px",
            fontWeight: "normal"
        }
    },
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    card: {
        width: "calc(20%)",
        "&:nth-child(5n)>div": {
            marginRight: 0
        }
    }
}));

const FavoriteArtifacts: React.FC = observer(() => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const favoriteArtifacts: Array<ArtifactTO> = useSelector(
        (state: RootState) => state.artifacts.favoriteArtifacts
    );
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);

    const fetchFavorite = useCallback(() => {
        try {
            dispatch(artifactAction.fetchFavoriteArtifacts());
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch]);

    const getRepoName = ((repoId: string) => {
        const assignedRepo = repos.find(repo => repo.id === repoId);
        return assignedRepo?.name;
    });

    useEffect(() => {
        fetchFavorite();
    }, [fetchFavorite]);

    return (
        <div className={classes.artifactContainer}>
            <h1>{t("category.favorite")}</h1>
            <div className={classes.container}>
                <ErrorBoundary>
                    {favoriteArtifacts?.map(artifact => (
                        <a
                            className={classes.card}
                            key={artifact.id}
                            rel="noreferrer"
                            target="_blank"
                            href={`/modeler/#/${artifact.repositoryId}/${artifact.id}/latest/`}>
                            <ArtifactCard
                                artifactRepo={getRepoName(artifact.repositoryId)}
                                artifactTitle={artifact.name}
                                image={artifact.svgPreview}
                                fileType={artifact.fileType} />
                        </a>
                    ))}
                    {favoriteArtifacts?.length === 0 && (
                        <span>{t("category.noFavoritesAvailable")}</span>
                    )}
                </ErrorBoundary>
            </div>
        </div>
    );
});

export default FavoriteArtifacts;
