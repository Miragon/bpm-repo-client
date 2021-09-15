import { List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { ArtifactVersionTO } from "../../../api";
import VersionListItem from "./Holder/VersionListItem";

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
    artifactVersionTOs: ArtifactVersionTO[];
}

const VersionDetails: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();

    useEffect(() => {
        if (props.artifactVersionTOs) {
            props.artifactVersionTOs.sort(compare);
        }
    }, [props.artifactVersionTOs]);

    const compare = (a: ArtifactVersionTO, b: ArtifactVersionTO) => {
        if (a.milestone < b.milestone) {
            return -1;
        }
        if (a.milestone > b.milestone) {
            return 1;
        }
        return 0;
    };

    return (
        <List className={classes.list}>
            {props.artifactVersionTOs?.map(version => (
                <VersionListItem
                    key={version.id}
                    artifactTitle={props.artifactTitle}
                    milestone={version.milestone}
                    comment={version.comment}
                    updatedDate={version.updatedDate}
                    id={version.id}
                    artifactId={version.artifactId}
                    file={version.file}
                    type={props.fileType}
                    repoId={version.repositoryId}
                    deployments={version.deployments} />
            ))}
        </List>
    );
});

export default VersionDetails;
