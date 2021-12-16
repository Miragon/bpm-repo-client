import { List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { ArtifactMilestoneTO } from "../../api";
import MilestoneListItem from "./Holder/MilestoneListItem";

const useStyles = makeStyles(() => ({
    list: {
        padding: "0px",
        borderRadius: "2px",
    },
}));

interface Props {
    artifactId: string;
    repoId: string;
    fileType: string;
    artifactTitle: string;
    artifactMilestoneTOs: ArtifactMilestoneTO[];
}

const MilestoneDetails: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();

    return (
        <List className={classes.list}>
            {props.artifactMilestoneTOs?.map(milestone => (
                <MilestoneListItem
                    key={milestone.id}
                    artifactTitle={props.artifactTitle}
                    milestone={milestone.milestone}
                    comment={milestone.comment}
                    updatedDate={milestone.updatedDate}
                    id={milestone.id}
                    artifactId={milestone.artifactId}
                    file={milestone.file}
                    type={props.fileType}
                    repoId={milestone.repositoryId}
                    deployments={milestone.deployments} />
            ))}
        </List>
    );
});

export default MilestoneDetails;
