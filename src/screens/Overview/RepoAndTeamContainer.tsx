import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {RepositoryTO} from "../../api";
import Section from "../../components/Layout/Section";
import {REPOSITORIES, SYNC_STATUS_REPOSITORY} from "../../constants/Constants";
import {fetchRepositories} from "../../store/actions";
import {RootState} from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import {getRepositoryUrl} from "../../util/Redirections";
import Card from "./Holder/Card";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(() => ({
    horizontalAlignment: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: "20px",
        columnGap: "20px"
    },
    tab: {
        flexGrow: 1,
        maxWidth: "100%"
    },

    tabList: {
        width: "100%"
    }
}));


const RepoAndTeamContainer: React.FC = observer(() => {
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
            helpers.makeErrorToast(t(error.response.data), () => fetchRepos())
        })
    }, [dispatch, t]);


    useEffect(() => {
        if (!syncStatusRepo) {
            fetchRepos();
        }
    }, [fetchRepos, syncStatusRepo]);


    return (
        <Section title="repository.repositories">


            <div className={classes.horizontalAlignment}>
                {allRepos.map(repo => (
                    <Card
                        key={repo.id}
                        title={repo.name}
                        onClick={() => history.push(getRepositoryUrl(repo))}
                        assignedUsers={repo.assignedUsers}
                        existingArtifacts={repo.existingArtifacts}/>
                ))}
                {allRepos?.length === 0 && (
                    <span>{t("repository.notAvailable")}</span>
                )}
            </div>

        </Section>
    );
});

export default RepoAndTeamContainer;
