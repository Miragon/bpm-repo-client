import {makeStyles} from "@material-ui/styles";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {DiagramTO} from "../../../api/models";
import {fetchDiagramsFromRepo} from "../../../store/actions";
import {RootState} from "../../../store/reducers/rootReducer";
import DiagramListItem from "./DiagramListItem";
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

const DiagramDetails: React.FC = (() => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { repoId } = useParams<{ repoId: string }>();
    const activeDiagrams: Array<DiagramTO> = useSelector(
        (state: RootState) => state.diagrams.diagrams
    );
    const synced = useSelector((state: RootState) => state.dataSynced.diagramSynced);

    const fetchActiveDiagrams = useCallback((repoId: string) => {
        try {
            dispatch(fetchDiagramsFromRepo(repoId));

        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!synced) {
            fetchActiveDiagrams(repoId);
        }

    }, [synced, fetchActiveDiagrams, repoId]);

    return (
        <>
            <div className={classes.container}>
                {activeDiagrams?.map(diagram => (
                    <DiagramListItem
                        key={diagram.id}
                        diagramTitle={diagram.name}
                        image={diagram.svgPreview}
                        updatedDate={diagram.updatedDate}
                        createdDate={diagram.createdDate}
                        description={diagram.description}
                        repoId={diagram.repositoryId}
                        diagramId={diagram.id}
                        fileType={diagram.fileType} />
                ))}
            </div>
        </>
    );
});
export default DiagramDetails;
