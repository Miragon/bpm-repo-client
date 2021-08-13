import {makeStyles} from "@material-ui/core/styles";
import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import DropdownButton, {DropdownButtonItem} from "../../components/Form/DropdownButton";
import SimpleButton from "../../components/Form/SimpleButton";
import ArtifactSearchBar from "../Overview/ArtifactSearchBar";
import CreateArtifactDialog from "./CreateArtifactDialog";
import CreateRepoDialog from "./CreateRepoDialog";
import UploadArtifactDialog from "./UploadArtifactDialog";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {ArtifactTypeTO} from "../../api";

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: "25px",
        display: "flex",
        justifyContent: "space-between",
        whiteSpace: "nowrap"
    },
    artifactButton: {
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
    const [uploadArtifactOpen, setUploadArtifactOpen] = useState(false);
    const [createArtifactOpen, setCreateArtifactOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState<string>("BPMN");
    const [artifactOptions, setArtifactOptions] = useState<Array<DropdownButtonItem>>([])

    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes);


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
                <ArtifactSearchBar />
                <div>
                    <SimpleButton
                        className={classes.repositoryButton}
                        title={t("repository.create")}
                        onClick={() => setCreateRepoOpen(true)} />
                    <DropdownButton
                        type={"default"}
                        className={classes.artifactButton}
                        title={t("artifact.create")}
                        options={artifactOptions} />
                </div>
            </div>
            <CreateRepoDialog
                open={createRepoOpen}
                onCreated={() => setCreateRepoOpen(false)}
                onCancelled={() => setCreateRepoOpen(false)} />

            <CreateArtifactDialog
                open={createArtifactOpen}
                type={createArtifactType}
                onCancelled={() => setCreateArtifactOpen(false)} />

            <UploadArtifactDialog
                open={uploadArtifactOpen}
                onCancelled={() => setUploadArtifactOpen(false)} />
        </>
    );
});

export default RepoContainer;
