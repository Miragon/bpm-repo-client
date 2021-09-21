import {makeStyles} from "@material-ui/core/styles";
import {observer} from "mobx-react";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {ArtifactTypeTO} from "../../api";
import DropdownButton, {DropdownButtonItem} from "../../components/Form/DropdownButton";
import SimpleButton from "../../components/Form/SimpleButton";
import {RootState} from "../../store/reducers/rootReducer";
import ArtifactSearchBar from "../Overview/ArtifactSearchBar";
import CreateArtifactDialog from "./CreateArtifactDialog";
import CreateRepoDialog from "./CreateRepoDialog";
import UploadArtifactDialog from "./UploadArtifactDialog";
import {createTeam} from "../../store/actions/teamAction";
import helpers from "../../util/helperFunctions";

const useStyles = makeStyles(() => ({
    container: {
        paddingTop: "16px",
        display: "flex",
        justifyContent: "space-between",
        whiteSpace: "nowrap"
    },
    button: {
        minWidth: "200px",
        marginLeft: "1rem"
    }
}));

const HeaderContainer: React.FC = observer(() => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [createRepoOpen, setCreateRepoOpen] = useState(false);
    const [uploadArtifactOpen, setUploadArtifactOpen] = useState(false);
    const [createArtifactOpen, setCreateArtifactOpen] = useState(false);
    const [createArtifactType, setCreateArtifactType] = useState("BPMN");
    const [artifactOptions, setArtifactOptions] = useState<DropdownButtonItem[]>([])

    const fileTypes: ArtifactTypeTO[] = useSelector((state: RootState) => state.artifacts.fileTypes);


    //TODO: Move Team-functions to separate section - just used here for quick test

    const name = "MyNewTeam"
    const description = "myDesc"

    const createNewTeam = useCallback(async(name: string, description: string) => {
        createTeam("MyNewTeam", "SomeDescription").then(response => {
            if(Math.floor(response.status / 100) === 2){
                console.log(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => createNewTeam(name, description))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => createNewTeam(name,description))
        })
    }, [t])


    useEffect(() => {
        const opts: DropdownButtonItem[] = []

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
        });
        opts.push({
            id: "createTeam",
            label: "CreateTeam",
            type: "button",
            onClick: () => createNewTeam(name, description)
        });
        setArtifactOptions(opts);
    }, [createNewTeam, fileTypes])

    return (
        <>
            <div className={classes.container}>
                <ArtifactSearchBar />
                <div>
                    <SimpleButton
                        className={classes.button}
                        title={t("repository.create")}
                        onClick={() => setCreateRepoOpen(true)} />
                    <DropdownButton
                        type={"default"}
                        className={classes.button}
                        title={t("artifact.create")}
                        options={artifactOptions} />
                </div>
            </div>

            <CreateRepoDialog
                open={createRepoOpen}
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

export default HeaderContainer;
