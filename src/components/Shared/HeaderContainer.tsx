import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ArtifactTypeTO } from "../../api";
import { createRepository } from "../../store/actions";
import { SYNC_STATUS_REPOSITORY } from "../../constants/Constants";
import DropdownButton, { DropdownButtonItem } from "./Form/DropdownButton";
import { RootState } from "../../store/reducers/rootReducer";
import ArtifactSearchBar from "../../screens/Overview/ArtifactSearchBar";
import CreateTitleDescDialog from "./Dialogs/CreateTitleDescDialog";
import CreateArtifactDialog from "../Repository/Dialogs/CreateArtifactDialog";
import UploadArtifactDialog from "./Dialogs/UploadArtifactDialog";

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: "16px",
        display: "flex",
        justifyContent: "space-between",
        whiteSpace: "nowrap"
    },
    button: {
        minWidth: "100px",
        marginLeft: "1rem"
    }
}));

const HeaderContainer: React.FC = (() => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [createRepoOpen, setCreateRepoOpen] = useState(false);
    const [uploadArtifactOpen, setUploadArtifactOpen] = useState(false);
    const [createArtifactOpen, setCreateArtifactOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("BPMN");
    const [artifactOptions, setArtifactOptions] = useState<DropdownButtonItem[]>([]);

    const fileTypes: ArtifactTypeTO[] = useSelector((state: RootState) => state.artifacts.fileTypes);

    useEffect(() => {
        const opts: DropdownButtonItem[] = [];

        opts.push({
            id: "createRepo",
            label: "repository.create",
            type: "button",
            onClick: () => setCreateRepoOpen(true)
        });
        // TODO: wieder aufnehmen
        /*
        opts.push({
            id: "createTeam",
            label: "team.create",
            type: "button",
            onClick: () => setCreateTeamOpen(true)
        });
        */
        opts.push({
            id: "divider1",
            type: "divider",
            label: ""
        });

        fileTypes?.forEach(fileType => {
            opts.push({
                id: fileType.name,
                label: `artifact.create${fileType.name}`,
                type: "button",
                onClick: () => {
                    setCreateArtifactOpen(true);
                    setCreateArtifactType(fileType.name);
                }
            });
        });
        opts.push({
            id: "divider2",
            type: "divider",
            label: ""
        });
        opts.push({
            id: "upload",
            label: "artifact.upload",
            type: "button",
            onClick: () => setUploadArtifactOpen(true)
        });

        setArtifactOptions(opts);
    }, [fileTypes]);

    return (
        <>
            <div className={classes.container}>
                <ArtifactSearchBar />
                <div>
                    <DropdownButton
                        type="default"
                        className={classes.button}
                        title={t("action.createNew")}
                        options={artifactOptions} />
                </div>
            </div>

            <CreateTitleDescDialog
                open={createRepoOpen}
                onCancelled={() => setCreateRepoOpen(false)}
                successMessage={t("repository.created")}
                title={t("repository.create")}
                createMethod={createRepository}
                dataSyncedType={SYNC_STATUS_REPOSITORY} />

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

export default HeaderContainer;
