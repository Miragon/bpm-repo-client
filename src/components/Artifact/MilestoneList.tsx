import {makeStyles} from "@material-ui/core/styles";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ArtifactMilestoneTO, ArtifactTO} from "../../api";
import {getAllMilestones} from "../../store/actions";
import helpers from "../../util/helperFunctions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {SYNC_STATUS_MILESTONE} from "../../constants/Constants";
import MilestoneDetails from "../../screens/Repository/MIlestone/MilestoneDetails";

interface Props {
    artifact: ArtifactTO;
}

const useStyles = makeStyles(() => ({
    root: {
        minHeight: "50px"
    },
    loading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px"
    }
}))

const MilestoneList: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const milestoneSynced = useSelector((state: RootState) => state.dataSynced.milestoneSynced);


    const [activeMilestones, setActiveMilestones] = useState<ArtifactMilestoneTO[]>([]);

    const getMilestones = useCallback(async (artifactId: string) => {
        const response = await getAllMilestones(artifactId);
        if (Math.floor(response.status / 100) === 2) {
            const sortedMilestones = response.data.sort(compare)
            setActiveMilestones(sortedMilestones);
            dispatch({type: SYNC_STATUS_MILESTONE, dataSynced: true})
        } else {
            helpers.makeErrorToast(t(response.data.toString()), () => getMilestones(artifactId))
        }
    }, [t, dispatch])

    useEffect(() => {
        getMilestones(props.artifact.id);
    }, [getMilestones, props.artifact]);

    useEffect(() => {
        if(!milestoneSynced){
            getMilestones(props.artifact.id);
        }
    }, [getMilestones, props.artifact, milestoneSynced])

    const compare = (a: ArtifactMilestoneTO, b: ArtifactMilestoneTO) => {
        if (a.milestone < b.milestone) {
            return -1;
        }
        if (a.milestone > b.milestone) {
            return 1;
        }
        return 0;
    };


    return (
        <div className={classes.root}>
            <MilestoneDetails
                artifactId={props.artifact.id}
                repoId={props.artifact.repositoryId}
                fileType={props.artifact.fileType}
                artifactMilestoneTOs={activeMilestones}
                artifactTitle={props.artifact.name} />
        </div>
    );
};

export default MilestoneList;
