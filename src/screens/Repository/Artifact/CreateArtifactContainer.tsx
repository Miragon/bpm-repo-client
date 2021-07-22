import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import DropdownButton, {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import CreateArtifactDialog from "../../CreateContainer/CreateArtifactDialog";
import UploadArtifactDialog from "../../CreateContainer/UploadArtifactDialog";
import {FileTypesTO, RepositoryTO} from "../../../api/models";
import {RootState} from "../../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "1rem"
    },
    artifactButton: {
        minWidth: "180px"
    }
}));

const CreateArtifactContainer: React.FC = observer(() => {
    const classes = useStyles();
    const {t} = useTranslation("common");

    const [uploadArtifactOpen, setUploadArtifactOpen] = useState(false);
    const [createArtifactOpen, setCreateArtifactOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState<string>("BPMN");
    const [artifactOptions, setArtifactOptions] = useState<Array<DropdownButtonItem>>([])

    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);

    const fileTypes: Array<FileTypesTO> = useSelector((state: RootState) => state.artifacts.fileTypes);


    useEffect(() => {
        const opts: Array<DropdownButtonItem> = []
        fileTypes?.forEach(fileType => {
            opts.push({id: fileType.name,
                label: `artifact.create${fileType.name}`,
                type: "button",
                onClick: () => {
                    setCreateArtifactOpen(true);
                    setCreateArtifactType(fileType.name)
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
            label: "artifact.upload",
            type: "button",
            onClick: () => setUploadArtifactOpen(true)
        })
        setOpts(opts)

    }, [fileTypes])


    const setOpts = (opts: Array<DropdownButtonItem>) => {
        setArtifactOptions(opts)
    }

    return (
        <>
            <div className={classes.container}>
                <DropdownButton
                    className={classes.artifactButton}
                    title={t("artifact.create")}
                    options={artifactOptions} />
            </div>

            <CreateArtifactDialog
                open={createArtifactOpen}
                type={createArtifactType}
                onCancelled={() => setCreateArtifactOpen(false)}
                repo={activeRepo} />


            <UploadArtifactDialog
                open={uploadArtifactOpen}
                onCancelled={() => setUploadArtifactOpen(false)}
                repo={activeRepo} />
        </>
    );
});

export default CreateArtifactContainer;
