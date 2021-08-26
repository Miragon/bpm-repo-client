import React from "react";
import {useDispatch} from "react-redux";
import {IconButton, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import {Settings} from "@material-ui/icons";


interface Props {
    artifactId: string,
    artifactName: string,
    onChangeMilestone: (milestone: number, artifactId: string, versionId: string) => void;
}

const DeploymentListItem: React.FC<Props> = props => {
    const dispatch = useDispatch();



    //TODO maybe fetch versions here


    const changeMilestone = (milestone: number, versionId: string) => {
        props.onChangeMilestone(milestone, props.artifactId, versionId)
    }


    //TODO: Fetching all Versions, including all files, will become very expensive => write new endpoint that returns only VersionIds and MileStones

    //TODO Der Dropdownbutton zum Auswählen der Version muss das komplette Versionsobjekt hinterlegt haben (damit die Id ausgewählt werden kann)


    return (
        <>
            <ListItem>
                <ListItemText
                    primary={props.artifactName}
                    secondary={"SettingsButton durch version auswählen dropdown ersetzen"} />

                <ListItemSecondaryAction>
                    <IconButton onClick={() => changeMilestone(1, "123")}>
                        <Settings />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </>
    );
}
export default DeploymentListItem;