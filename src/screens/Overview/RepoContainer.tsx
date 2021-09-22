import {observer} from "mobx-react";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {RepositoryTO, TeamTO} from "../../api";
import Section from "../../components/Layout/Section";
import {REPOSITORIES, SYNC_STATUS_REPOSITORY, SYNC_STATUS_TEAM, TEAMS} from "../../constants/Constants";
import {fetchRepositories} from "../../store/actions";
import {RootState} from "../../store/reducers/rootReducer";
import helpers from "../../util/helperFunctions";
import {getRepositoryUrl, getTeamUrl} from "../../util/Redirections";
import Card from "./Holder/Card";
import {makeStyles} from "@material-ui/styles";
import {TabContext, TabList, TabPanel} from "@material-ui/lab";
import {Tab} from "@material-ui/core";
import {getAllTeams} from "../../store/actions/teamAction";

const useStyles = makeStyles(() => ({
    horizontalAlignment: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "start",
        flexWrap: "wrap",
        rowGap: "20px",
        columnGap: "30px"
    },
    tab: {
        flexGrow: 1,
        maxWidth: "100%"
    },

    tabList: {
        width: "100%"
    }
}));


const RepoContainer: React.FC = observer(() => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const { t } = useTranslation("common");

    const allRepos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const allTeams: Array<TeamTO> = useSelector((state: RootState) => state.team.teams);
    const syncStatusTeam: boolean = useSelector((state: RootState) => state.dataSynced.teamSynced);
    const syncStatusRepo: boolean = useSelector((state: RootState) => state.dataSynced.repoSynced);

    const [openedTab, setOpenedTab] = useState<string>("0");


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

    const fetchTeams = useCallback(() => {
        getAllTeams().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: TEAMS, teams: response.data });
                dispatch({ type: SYNC_STATUS_TEAM, dataSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchTeams())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchTeams())
        })
    }, [dispatch, t]);

    useEffect(() => {
        if (!syncStatusRepo) {
            fetchRepos();
        }
    }, [fetchRepos, syncStatusRepo]);

    useEffect(() => {
        if (!syncStatusTeam) {
            fetchTeams();
        }
    }, [fetchTeams, syncStatusTeam]);

    const handleChangeTab = (event: any, newValue: string) => {
        setOpenedTab(newValue)
    }

    return (
        <Section title="repository.repositories">

            <TabContext value={openedTab} >

                <TabList onChange={handleChangeTab} >
                    <Tab label={t("repository.repositories")} value="0"  className={classes.tab} fullWidth={true}/>
                    <Tab label={t("team.teams")} value="1" className={classes.tab} fullWidth={true}/>
                </TabList>

                <TabPanel value="0" >
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
                </TabPanel>

                <TabPanel value="1" >
                    <div className={classes.horizontalAlignment}>
                        {allTeams.map(team => (
                            <Card
                                key={team.id}
                                title={team.name}
                                assignedUsers={team.assignedUsers}
                                existingArtifacts={0}
                                onClick={() => history.push(getTeamUrl(team))} />
                        ))}
                        {allRepos?.length === 0 && (
                            <span>{t("repository.notAvailable")}</span>
                        )}
                    </div>
                </TabPanel>

            </TabContext>


        </Section>
    );
});

export default RepoContainer;
