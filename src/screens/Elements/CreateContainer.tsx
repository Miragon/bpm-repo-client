import {makeStyles} from "@material-ui/core/styles";
import {observer} from "mobx-react";
import React, {useState} from "react";
import DropdownButton, {DropdownButtonItem} from "../../components/Form/DropdownButton";
import SimpleButton from "../../components/Form/SimpleButton";
import CreateDiagramDialog from "./CreateDiagramDialog";
import CreateRepoDialog from "./CreateRepoDialog";
import UploadDiagramDialog from "./UploadDiagramDialog";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        justifyContent: "flex-end"
    },
    diagramButton: {
        minWidth: "180px"
    },
    repositoryButton: {
        minWidth: "180px",
        marginRight: "1rem"
    }
}));

const RepoContainer: React.FC = observer(() => {
    const classes = useStyles();

    const [createRepoOpen, setCreateRepoOpen] = useState(false);
    const [uploadDiagramOpen, setUploadDiagramOpen] = useState(false);
    const [createDiagramOpen, setCreateDiagramOpen] = useState(false);
    const [createDiagramType, setCreateDiagramType] = useState<"bpmn" | "dmn">("bpmn");


    const diagramOptions: DropdownButtonItem[] = [
        {
            id: "bpmn",
            label: "Create BPMN Diagram",
            type: "button",
            onClick: () => {
                setCreateDiagramOpen(true);
                setCreateDiagramType("bpmn");
            }
        },
        {
            id: "dmn",
            label: "Create DMN Diagram",
            type: "button",
            onClick: () => {
                setCreateDiagramOpen(true);
                setCreateDiagramType("dmn");
            }
        },
        {
            id: "divider1",
            type: "divider",
            label: "",
            onClick: () => { /* Do nothing */ }
        },
        {
            id: "upload",
            label: "Upload Diagram",
            type: "button",
            onClick: () => setUploadDiagramOpen(true)
        },
        {
            id: "import",
            label: "Import from Cawemo",
            type: "button",
            onClick: () => console.log("Import")
        }
    ];

    return (
        <>
            <div className={classes.container}>
                <SimpleButton
                    className={classes.repositoryButton}
                    title="Create Repository"
                    onClick={() => setCreateRepoOpen(true)} />
                <DropdownButton
                    className={classes.diagramButton}
                    title="Add Diagram"
                    options={diagramOptions} />
            </div>
            <CreateRepoDialog
                open={createRepoOpen}
                onCreated={() => setCreateRepoOpen(false)}
                onCancelled={() => setCreateRepoOpen(false)} />

            <CreateDiagramDialog
                open={createDiagramOpen}
                type={createDiagramType}
                onCancelled={() => setCreateDiagramOpen(false)} />

            <UploadDiagramDialog
                open={uploadDiagramOpen}
                onCancelled={() => setUploadDiagramOpen(false)} />
        </>
    );
});

export default RepoContainer;

