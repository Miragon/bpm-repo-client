import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {ArtifactTypeTO, RepositoryTO} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import CreateArtifactDialog from "../../../components/Shared/Dialogs/CreateArtifactDialog";
import UploadArtifactDialog from "../../../components/Shared/Dialogs/UploadArtifactDialog";
import DropdownButton, {DropdownButtonItem} from "../Form/DropdownButton";


const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        justifyContent: "flex-end",
    },
    artifactButton: {
        minWidth: "200px"
    }
}));

const ArtifactManagementContainer: React.FC = (() => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [uploadArtifactOpen, setUploadArtifactOpen] = useState(false);
    const [createArtifactOpen, setCreateArtifactOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("BPMN");
    const [artifactOptions, setArtifactOptions] = useState<DropdownButtonItem[]>([])

    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);
    const fileTypes: ArtifactTypeTO[] = useSelector((state: RootState) => state.artifacts.fileTypes);

    useEffect(() => {
        const opts: Array<DropdownButtonItem> = []
        fileTypes?.forEach(fileType => {
            opts.push({
                id: fileType.name,
                label: `artifact.create${fileType.name}`,
                type: "button",
                onClick: () => {
                    setCreateArtifactOpen(true);
                    setCreateArtifactType(fileType.name)
                }
            });
        });
        opts.push({
            id: "divider1",
            type: "divider",
            label: ""
        });
        opts.push({
            id: "upload",
            label: "artifact.upload",
            type: "button",
            onClick: () => setUploadArtifactOpen(true)
        })
        setArtifactOptions(opts);
    }, [fileTypes])

    return (
        <>
            <div className={classes.container}>
                <DropdownButton
                    type={"default"}
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

export default ArtifactManagementContainer;
