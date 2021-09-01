import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
    Divider,
    FormControl,
    InputLabel,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Select
} from "@material-ui/core";
import {getAllVersions} from "../../../../store/actions";
import {DEPLOYMENT_VERSIONS} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";
import {useTranslation} from "react-i18next";
import {ArtifactVersionTO} from "../../../../api";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(() => ({

    select: {
        minWidth: "80px",
        alignSelf: "center"
    }
}));

interface Props {
    artifactId: string;
    artifactName: string;
    onChangeMilestone: (artifactId: string, versionId: string) => void;
}

const DeploymentListItem: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");

    const [versions, setVersions] = useState<ArtifactVersionTO[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<string>("");


    const getVersions = useCallback(async (artifactId: string) => {
        getAllVersions(artifactId).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                dispatch({type: DEPLOYMENT_VERSIONS, deploymentVersions: response.data})
                setVersions(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getVersions(artifactId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getVersions(artifactId))
        })
    }, [dispatch, t])


    useEffect(() => {
        getVersions(props.artifactId)
    }, [getVersions, props.artifactId])

    const changeMilestone = (versionId: string) => {
        props.onChangeMilestone(props.artifactId, versionId)
    }


    //TODO: Fetching all Versions, including all files, will become very expensive => write new endpoint that returns only VersionIds and MileStones

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        changeMilestone(event.target.value as string);
        setSelectedVersion(event.target.value as string)
    };


    return (
        <>
            <ListItem>
                <ListItemText
                    primary={props.artifactName}
                    secondary={"sadas"}/>

                <ListItemSecondaryAction>
                    <FormControl >
                        <InputLabel id="versionSelector">{t("version.version")}</InputLabel>
                        <Select
                            required
                            className={classes.select}
                            labelId="versionSelector"
                            id="selector"
                            value={selectedVersion}
                            onChange={handleChange} >
                            {versions.map(version => (
                                <MenuItem key={version.id} value={version.id}>{version.milestone}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
        </>
    );
}
export default DeploymentListItem;
