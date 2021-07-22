import {makeStyles} from "@material-ui/core/styles";
import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import DropdownButton, {DropdownButtonItem} from "../../components/Form/DropdownButton";
import SimpleButton from "../../components/Form/SimpleButton";
import DiagramSearchBar from "../Overview/DiagramSearchBar";
import CreateDiagramDialog from "./CreateDiagramDialog";
import CreateRepoDialog from "./CreateRepoDialog";
import UploadDiagramDialog from "./UploadDiagramDialog";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {FileTypesTO} from "../../api/models";

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: "25px",
        display: "flex",
        justifyContent: "space-between"
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
    const {t} = useTranslation("common");
    const [createRepoOpen, setCreateRepoOpen] = useState(false);
    const [uploadDiagramOpen, setUploadDiagramOpen] = useState(false);
    const [createDiagramOpen, setCreateDiagramOpen] = useState(false);
    const [createDiagramType, setCreateDiagramType] = useState<string>("BPMN");
    const [diagramOptions, setDiagramOptions] = useState<Array<DropdownButtonItem>>([])

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
                <DiagramSearchBar />
                <div>
                    <SimpleButton
                        className={classes.repositoryButton}
                        title={t("repository.create")}
                        onClick={() => setCreateRepoOpen(true)} />
                    <DropdownButton
                        className={classes.diagramButton}
                        title={t("diagram.create")}
                        options={diagramOptions} />
                </div>
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
