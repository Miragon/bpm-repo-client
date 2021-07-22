import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import DropdownButton, {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import CreateDiagramDialog from "../../CreateContainer/CreateDiagramDialog";
import UploadDiagramDialog from "../../CreateContainer/UploadDiagramDialog";
import {FileTypesTO, RepositoryTO} from "../../../api/models";
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
    const [createDiagramType, setCreateDiagramType] = useState<string>("BPMN");
    const [diagramOptions, setDiagramOptions] = useState<Array<DropdownButtonItem>>([])

    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);

    const fileTypes: Array<FileTypesTO> = useSelector((state: RootState) => state.diagrams.fileTypes);


    useEffect(() => {
        const opts: Array<DropdownButtonItem> = []
        fileTypes?.forEach(fileType => {
            opts.push({id: fileType.name,
                label: `artifact.create${fileType.name}`,
                type: "button",
                onClick: () => {
                    setCreateDiagramOpen(true);
                    setCreateDiagramType(fileType.name)
                }});
        })

        opts.push({
            id: "divider1",
            type: "divider",
            label: "",
            onClick: () => { /* Do nothing */
            }
        })
        opts.push({
            id: "upload",
            label: "diagram.upload",
            type: "button",
            onClick: () => setUploadDiagramOpen(true)
        })
        setOpts(opts)

    }, [fileTypes])


    const setOpts = (opts: Array<DropdownButtonItem>) => {
        setDiagramOptions(opts)
    }

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
