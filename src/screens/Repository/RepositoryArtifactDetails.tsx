import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactTO, ArtifactVersionTO } from "../../api";
import { getAllVersions } from "../../store/actions";
import helpers from "../../util/helperFunctions";
import VersionDetails from "./Version/VersionDetails";

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

const RepositoryArtifactDetails: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [activeVersions, setActiveVersions] = useState<ArtifactVersionTO[]>([]);

    const getVersions = useCallback(async (artifactId: string) => {
        const response = await getAllVersions(artifactId);
        if (Math.floor(response.status / 100) === 2) {
            setActiveVersions(response.data);
        } else {
            helpers.makeErrorToast(t(response.data.toString()), () => getVersions(artifactId))
        }
    }, [t])

    useEffect(() => {
        getVersions(props.artifact.id);
    }, [getVersions, props.artifact]);


    return (
        <div className={classes.root}>
            <VersionDetails
                artifactId={props.artifact.id}
                repoId={props.artifact.repositoryId}
                fileType={props.artifact.fileType}
                artifactVersionTOs={activeVersions}
                artifactTitle={props.artifact.name} />
        </div>
    );
};

export default RepositoryArtifactDetails;
