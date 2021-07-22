import {makeStyles} from "@material-ui/core/styles";
import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import RepoCard from "./Holder/RepoCard";
import {RepositoryTO} from "../../api/models";
import {RootState} from "../../store/reducers/rootReducer";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import {fetchRepositories} from "../../store/actions/repositoryAction";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    header: {
        display: "flex",
        marginTop: "2rem"
    },
    headerText: {
        color: "black",
        fontSize: "20px"
    },
    container: {
        display: "flex",
        flexWrap: "wrap",
        padding: "1rem 0",
    }
}));

const RepoContainer: React.FC = observer(() => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation("common");

    const allRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.repoSynced);
    const fetchRepos = useCallback(() => {
        try {
            dispatch(fetchRepositories());
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!syncStatus) {
            fetchRepos();
        }
    }, [dispatch, fetchRepos, syncStatus]);

    const openRepoScreen = (repo: RepositoryTO) => {
        history.push(`/repository/${repo.id}`);
    };

    return (
        <>
            <div className={classes.header}>
                <div className={classes.headerText}>
                    {t("repository.repository")}
                </div>
            </div>

            <div className={classes.container}>
                <ErrorBoundary>
                    {allRepos.map(repo => (
                        // eslint-disable-next-line react/jsx-key
                        <RepoCard
                            key={repo.id}
                            repoTitle={repo.name}
                            description={repo.description}
                            existingArtifacts={repo.existingArtifacts}
                            assignedUsers={repo.assignedUsers}
                            onClick={() => openRepoScreen(repo)} />
                    ))}
                    {allRepos?.length === 0 && (
                        <span>{t("repository.notAvailable")}</span>
                    )}
                </ErrorBoundary>
            </div>
        </>
    );
});

export default RepoContainer;
