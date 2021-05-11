import { makeStyles } from "@material-ui/styles";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useStore } from "../../providers/RootStoreProvider";
import './DiagramContainer.css'
import DiagramCard from "./Holder/DiagramCard";

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

const StarredDiagrams: React.FC = observer(() => {
    const classes = useStyles();
    const store = useStore();

    useEffect(() => {
        store.diagramStore.initializeStarred();
        // .then(() => {})
        // .catch(e => {});
    }, [store.diagramStore])

    const diagrams = store.diagramStore.getStarredDiagrams();

    return <div className={classes.diagramContainer}>
        <h1>Favorites</h1>
        <div className={classes.container}>
            {diagrams.map(diagram => (
                <a
                    className={classes.card}
                    key={diagram.bpmnDiagramId}
                    rel="noreferrer"
                    target="_blank"
                    href={`/modeler/#/${diagram.bpmnRepositoryId}/${diagram.bpmnDiagramId}/latest/`}>
                    <DiagramCard
                        diagramTitle={diagram.bpmnDiagramName}
                        image={diagram.svgPreview}
                        updatedDate={diagram.updatedDate}
                        description={diagram.bpmnDiagramDescription}
                        repositoryId={diagram.bpmnRepositoryId} />
                </a>
            ))}
            {diagrams.length === 0 && (
                <span>You haven&apos;t added any diagrams to your favorites yet.</span>
            )}
        </div>
    </div>
});

export default StarredDiagrams;
