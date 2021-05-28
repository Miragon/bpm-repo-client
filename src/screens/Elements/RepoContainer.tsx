import {makeStyles} from "@material-ui/core/styles";
import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import RepoCard from "./Holder/RepoCard";
import {BpmnRepositoryRequestTO} from "../../api/models";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import 'react-toastify/dist/ReactToastify.css';
import {fetchDiagramsFromRepo, SYNC_STATUS} from "../../store/actions/diagramAction";
import {ACTIVE_REPO, fetchRepositories} from "../../store/actions/repositoryAction";
import {useHistory} from "react-router-dom";
import Repository from "../Repository";


const useStyles = makeStyles(() => ({
    header: {
        display: "flex"
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
    const dispatch = useDispatch()
    const history = useHistory();



    const allRepos: Array<BpmnRepositoryRequestTO> = useSelector((state: RootState) => state.repos.repos)
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.dataSynced)
    const fetchRepos = useCallback(() => {
        try {
            dispatch(fetchRepositories())
        } catch (err) {
            console.log(err);
        }
    }, [dispatch])

    useEffect(() => {
        fetchRepos();
        if(!syncStatus){
            fetchRepos()
            dispatch({type: SYNC_STATUS, dataSynced: false})
        }

    }, [dispatch, fetchRepos, syncStatus])



    const openRepoScreen = (repo: BpmnRepositoryRequestTO) => {
        dispatch({type: ACTIVE_REPO, activeRepo: repo})
        history.push("/repository")
    }

    return (
        <>
            <div className={classes.header}>
                <div className={classes.headerText} >
                    Repositories
                </div>
            </div>

            <div className={classes.container}>
                <ErrorBoundary>
                {allRepos.map(repo => (
                    // eslint-disable-next-line react/jsx-key
                    <RepoCard
                        repoTitle={repo.bpmnRepositoryName}
                        description={repo.bpmnRepositoryDescription}
                        existingDiagrams={repo.existingDiagrams}
                        assignedUsers={repo.assignedUsers}
                        onClick={() => openRepoScreen(repo)}/>
                ))}
                </ErrorBoundary>
            </div>
        </>
    );
});

export default RepoContainer;

