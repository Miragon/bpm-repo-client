import {makeStyles} from "@material-ui/styles";
import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import './DiagramContainer.css'
import DiagramCard from "./Holder/DiagramCard";
import {BpmnDiagramTO, BpmnRepositoryRequestTO} from "../../api/models";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import * as diagramAction from "../../store/actions/diagramAction";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";

const useStyles = makeStyles(() => ({
    diagramContainer: {
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

const RecentDiagrams: React.FC = observer(() => {
    const classes = useStyles();
    const dispatch = useDispatch();


    const recentDiagrams: Array<BpmnDiagramTO> = useSelector((state: RootState) => state.recentDiagrams.recentDiagrams)
    const repos: Array<BpmnRepositoryRequestTO> = useSelector((state: RootState) => state.repos.repos)

    const fetchRecent = useCallback(() => {
        try{
            dispatch(diagramAction.fetchRecentDiagrams())
        } catch (err) {
            console.log(err)
        }
    }, [dispatch])

    const getRepoName = ((repoId: string) => {
        const assignedRepo = repos.find(repo => repo.bpmnRepositoryId === repoId)
        return assignedRepo?.bpmnRepositoryName
    })

    useEffect(() => {
        fetchRecent()
    }, [dispatch, fetchRecent])

    return <div className={classes.diagramContainer}>
        <h1>Recently Used</h1>
        <div className={classes.container}>
            <ErrorBoundary>
            {recentDiagrams?.map(diagram => (
                <a
                    className={classes.card}
                    key={diagram.bpmnDiagramId}
                    rel="noreferrer"
                    target="_blank"
                    href={`/modeler/#/${diagram.bpmnRepositoryId}/${diagram.bpmnDiagramId}/latest/`}>
                    <DiagramCard
                        diagramRepo={getRepoName(diagram.bpmnRepositoryId)}
                        diagramTitle={diagram.bpmnDiagramName}
                        image={diagram.svgPreview}
                        updatedDate={diagram.updatedDate}
                        description={diagram.bpmnDiagramDescription}
                        repositoryId={diagram.bpmnRepositoryId} />
                </a>
            ))}
            </ErrorBoundary>
        </div>
    </div>
});

export default RecentDiagrams;
