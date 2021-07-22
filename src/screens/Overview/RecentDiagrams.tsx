import {makeStyles} from "@material-ui/styles";
import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {DiagramTO, RepositoryTO} from "../../api/models";
import {ErrorBoundary} from "../../components/Exception/ErrorBoundary";
import * as diagramAction from "../../store/actions/diagramAction";
import {RootState} from "../../store/reducers/rootReducer";
import DiagramCard from "./Holder/DiagramCard";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    diagramContainer: {
        marginTop: "1rem",
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
    const {t} = useTranslation("common");


    const recentDiagrams: Array<DiagramTO> = useSelector(
        (state: RootState) => state.diagrams.recentDiagrams
    );
    const repos: Array<RepositoryTO> = useSelector((state: RootState) => state.repos.repos);
    const syncStatus: boolean = useSelector((state: RootState) => state.dataSynced.recentSynced);

    const fetchRecent = useCallback(() => {
        try {
            dispatch(diagramAction.fetchRecentDiagrams());
        } catch (err) {
            console.log(err);
        }
    }, [dispatch]);

    const getRepoName = ((repoId: string) => {
        const assignedRepo = repos.find(repo => repo.id === repoId);
        return assignedRepo?.name;
    });

    useEffect(() => {
        if (!syncStatus) {
            fetchRecent();
        }
    }, [dispatch, fetchRecent, syncStatus]);

    return (
        <div className={classes.diagramContainer}>
            <h1>{t("category.recent")}</h1>
            <div className={classes.container}>
                <ErrorBoundary>
                    {recentDiagrams?.map(diagram => (
                        <a
                            className={classes.card}
                            key={diagram.id}
                            rel="noreferrer"
                            target="_blank"
                            href={`/modeler/#/${diagram.repositoryId}/${diagram.id}/latest/`}>
                            <DiagramCard
                                diagramRepo={getRepoName(diagram.repositoryId)}
                                diagramTitle={diagram.name}
                                image={diagram.svgPreview}
                                fileType={diagram.fileType}/>
                        </a>
                    ))}
                    {recentDiagrams?.length === 0 && (
                        <span>{t("category.recent")}</span>
                    )}
                </ErrorBoundary>
            </div>
        </div>
    );
});

export default RecentDiagrams;
