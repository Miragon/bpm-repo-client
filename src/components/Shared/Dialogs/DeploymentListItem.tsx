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
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {ArtifactMilestoneTO} from "../../../api";
import {getAllMilestones} from "../../../store/actions";
import {DEPLOYMENT_MILESTONES} from "../../../constants/Constants";
import {makeErrorToast} from "../../../util/toastUtils";


const useStyles = makeStyles(() => ({

    select: {
        minWidth: "80px",
        alignSelf: "center"
    }
}));

interface Props {
    artifactId: string;
    artifactName: string;
    onChangeMilestone: (artifactId: string, milestoneId: string) => void;
}

const DeploymentListItem: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");

    const [milestones, setMilestones] = useState<ArtifactMilestoneTO[]>([]);
    const [selectedMilestone, setSelectedMilestone] = useState<string>("");


    const getMilestones = useCallback(async (artifactId: string) => {
        getAllMilestones(artifactId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({type: DEPLOYMENT_MILESTONES, deploymentMilestones: response.data})
                setMilestones(response.data)
            } else {
                makeErrorToast(t(response.data.toString()), () => getMilestones(artifactId))
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => getMilestones(artifactId))
        })
    }, [dispatch, t])


    useEffect(() => {
        getMilestones(props.artifactId)
    }, [getMilestones, props.artifactId])

    const changeMilestone = (milestoneId: string) => {
        props.onChangeMilestone(props.artifactId, milestoneId)
    }

    //TODO: Fetching all Milestones, including all files, will become very expensive => write new endpoint that returns only MilestoneIds and MileStones
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        changeMilestone(event.target.value as string);
        setSelectedMilestone(event.target.value as string)
    };

    return (
        <>
            <ListItem>
                <ListItemText
                    primary={props.artifactName}
                    secondary={"sadas"}/>

                <ListItemSecondaryAction>
                    <FormControl>
                        <InputLabel id="milestoneSelector">{t("milestone.milestone")}</InputLabel>
                        <Select
                            required
                            className={classes.select}
                            labelId="milestoneSelector"
                            id="selector"
                            value={selectedMilestone}
                            onChange={handleChange}>
                            {milestones.map(milestone => (
                                <MenuItem key={milestone.id} value={milestone.id}>{milestone.milestone}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                </ListItemSecondaryAction>
            </ListItem>
            <Divider/>
        </>
    );
}
export default DeploymentListItem;
