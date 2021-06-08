import React, {useCallback, useEffect} from 'react';
import {BpmnDiagramTO, BpmnRepositoryRequestTO} from "../../api/models";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {makeStyles} from "@material-ui/styles";
import DiagramListItem from "./DiagramListItem";
import {fetchDiagramsFromRepo} from "../../store/actions/diagramAction";


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

    const activeDiagrams: Array<BpmnDiagramTO> = useSelector((state: RootState) => state.activeDiagrams.activeDiagrams)
    const activeRepo: BpmnRepositoryRequestTO = useSelector((state: RootState) => state.activeRepo.activeRepo)

    const fetchActiveDiagrams = useCallback((repoId: string) => {
        try  {
            dispatch(fetchDiagramsFromRepo(repoId))
        } catch (err) {
            console.log(err)
        }
    }, [dispatch])

    useEffect(() => {
        fetchActiveDiagrams(activeRepo?.bpmnRepositoryId)
    }, [fetchActiveDiagrams, activeRepo])

    const openModeler = (repoId: string, diagramId: string) => {
        window.open(`/modeler/#/${repoId}/${diagramId}/latest/`, '_blank')?.focus();
    }

    return (
        <>
      <div className={classes.container}>
          {activeDiagrams?.map(diagram => (
              <div
                  key={diagram.bpmnDiagramId}
                  onClick={() => openModeler(diagram.bpmnRepositoryId, diagram.bpmnDiagramId)}>

              <DiagramListItem diagramTitle={diagram.bpmnDiagramName}
                               image={diagram.svgPreview}
                               updatedDate={diagram.updatedDate}
                               createdDate={diagram.createdDate}
                               description={diagram.bpmnDiagramDescription}
                               repoId={diagram.bpmnRepositoryId}
                               diagramId={diagram.bpmnDiagramId}
                                />
              </div>
          ))}
      </div>
        </>
    );
});
export default DiagramDetails;