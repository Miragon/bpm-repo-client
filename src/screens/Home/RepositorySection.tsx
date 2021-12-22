import { makeStyles } from "@material-ui/styles";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { RepositoryTO } from "../../api";
import RepositoryCard from "../../components/Layout/Repositories/RepositoryCard";
import { REPOSITORIES, SYNC_STATUS_REPOSITORY } from "../../constants/Constants";
import { fetchRepositories } from "../../store/actions";
import { RootState } from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import { getRepositoryUrl } from "../../util/Redirections";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: "0 -0.5rem 2rem -0.5rem"
    }
}));


const RepositorySection: React.FC = (() => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation("common");

    const allRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const syncStatusRepo: boolean = useSelector((state: RootState) => state.dataSynced.repoSynced);

    const fetchRepos = useCallback(() => {
        fetchRepositories().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: REPOSITORIES, repos: response.data });
                dispatch({ type: SYNC_STATUS_REPOSITORY, dataSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchRepos())
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchRepos())
        })
    }, [dispatch, t]);

    useEffect(() => {
        if (!syncStatusRepo) {
            fetchRepos();
        }
    }, [fetchRepos, syncStatusRepo]);

    return (
        <div className={classes.root}>
            {allRepos.map(repo => (
                <RepositoryCard
                    key={repo.id}
                    repository={repo}
                    onClick={() => history.push(getRepositoryUrl(repo))} />
            ))}
            {allRepos?.length === 0 && (
                <span>{t("repository.notAvailable")}</span>
            )}
        </div>
    );
});

export default RepositorySection;
