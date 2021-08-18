import {makeStyles} from "@material-ui/styles";
import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, RepositoryTO} from "../../api";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import {RootState} from "../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";
import helpers from "../../constants/Functions";
import ArtifactListItemRough from "./Holder/ArtifactListItemRough";
import {fetchRecentArtifacts} from "../../store/actions";

const useStyles = makeStyles(() => ({
    artifactContainer: {

        marginTop: "1rem",
        "&>h1": {
            color: "black",
            fontSize: "1.3rem",
            fontWeight: "normal"
        }
    },
    container: {

    },
    card: {
        width: "calc(20%)",
        "&:nth-child(5n)>div": {
            marginRight: 0
        }
    }
}));

const RecentArtifacts: React.FC = observer(() => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const recentArtifacts: Array<ArtifactTO> = useSelector(
        (state: RootState) => state.artifacts.recentArtifacts
    );
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.recentSynced);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);


    const fetchRecent = useCallback(() => {
        try {
            dispatch(fetchRecentArtifacts());
        } catch (err) {
            console.log(err);
        }
    }, [dispatch]);


    useEffect(() => {
        if (!syncStatus) {
            fetchRecent();
        }
    }, [dispatch, fetchRecent, syncStatus]);


    return (
        <div className={classes.artifactContainer}>
            <h1>{t("category.recent")}</h1>
            <div className={classes.container}>
                <ErrorBoundary>
                    {recentArtifacts?.map(artifact => (
                        <div
                            key={artifact.id}>
                            <ArtifactListItemRough
                                artifactTitle={artifact.name}
                                createdDate={artifact.createdDate}
                                updatedDate={artifact.updatedDate}
                                description={artifact.description}
                                repoId={artifact.repositoryId}
                                artifactId={artifact.id}
                                fileType={artifact.fileType}
                                favorite={helpers.isFavorite(artifact.id, favoriteArtifacts?.map(artifact => artifact.id))}
                                repository={helpers.getRepoName(artifact.repositoryId, repos)}/>
                        </div>
                    ))}
                    {recentArtifacts?.length === 0 && (
                        <span>{t("category.recent")}</span>
                    )}
                </ErrorBoundary>
            </div>
        </div>
    );
});

export default RecentArtifacts;
