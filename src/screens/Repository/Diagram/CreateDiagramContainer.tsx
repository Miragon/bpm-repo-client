import {observer} from "mobx-react";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import DropdownButton, {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import CreateDiagramDialog from "../../CreateContainer/CreateDiagramDialog";
import UploadDiagramDialog from "../../CreateContainer/UploadDiagramDialog";
import {RepositoryTO} from "../../../api/models";
import {RootState} from "../../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "1rem"
    },
    diagramButton: {
        minWidth: "180px"
    }
}));

const CreateDiagramContainer: React.FC = observer(() => {
    const classes = useStyles();
    const {t} = useTranslation("common");

    const [uploadDiagramOpen, setUploadDiagramOpen] = useState(false);
    const [createDiagramOpen, setCreateDiagramOpen] = useState(false);
    const [createFormOpen, setCreateFormOpen] = useState(false);
    const [createConfigOpen, setCreateConfigOpen] = useState(false);
    const [createDiagramType, setCreateDiagramType] = useState<"bpmn" | "dmn" >("bpmn");
    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);

    const diagramOptions: DropdownButtonItem[] = [
        {
            id: "bpmn",
            label: "diagram.createBpmn",
            type: "button",
            onClick: () => {
                setCreateDiagramOpen(true);
                setCreateDiagramType("bpmn");
            }
        },
        {
            id: "dmn",
            label: "diagram.createDmn",
            type: "button",
            onClick: () => {
                setCreateDiagramOpen(true);
                setCreateDiagramType("dmn");
            }
        },
        {
            id: "form",
            label: "form.create",
            type: "button",
            onClick: () => {
                setCreateFormOpen(true);
            }
        },
        {
            id: "config",
            label: "config.create",
            type: "button",
            onClick: () => {
                setCreateConfigOpen(true);
            }
        },
        {
            id: "divider1",
            type: "divider",
            label: "",
            onClick: () => { /* Do nothing */
            }
        },
        {
            id: "upload",
            label: "diagram.upload",
            type: "button",
            onClick: () => setUploadDiagramOpen(true)
        }
    ];

    return (
        <>
            <div className={classes.container}>
                <DropdownButton
                    className={classes.diagramButton}
                    title={t("diagram.create")}
                    options={diagramOptions} />
            </div>

            <CreateDiagramDialog
                open={createDiagramOpen}
                type={createDiagramType}
                onCancelled={() => setCreateDiagramOpen(false)}
                repo={activeRepo} />


            <UploadDiagramDialog
                open={uploadDiagramOpen}
                onCancelled={() => setUploadDiagramOpen(false)}
                repo={activeRepo} />
        </>
    );
});

export default CreateDiagramContainer;
