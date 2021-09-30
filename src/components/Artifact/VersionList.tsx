import {makeStyles} from "@material-ui/core/styles";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ArtifactTO, ArtifactVersionTO} from "../../api";
import {getAllVersions} from "../../store/actions";
import helpers from "../../util/helperFunctions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {SYNC_STATUS_VERSION} from "../../constants/Constants";
import VersionDetails from "../../screens/Repository/Version/VersionDetails";

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

const VersionList: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const versionSynced = useSelector((state: RootState) => state.dataSynced.versionSynced);


    const [activeVersions, setActiveVersions] = useState<ArtifactVersionTO[]>([]);

    const getVersions = useCallback(async (artifactId: string) => {
        const response = await getAllVersions(artifactId);
        if (Math.floor(response.status / 100) === 2) {
            const sortedVersions = response.data.sort(compare)
            setActiveVersions(sortedVersions);
            dispatch({type: SYNC_STATUS_VERSION, dataSynced: true})
        } else {
            helpers.makeErrorToast(t(response.data.toString()), () => getVersions(artifactId))
        }
    }, [t, dispatch])

    useEffect(() => {
        getVersions(props.artifact.id);
    }, [getVersions, props.artifact]);

    useEffect(() => {
        if(!versionSynced){
            getVersions(props.artifact.id);
        }
    }, [getVersions, props.artifact, versionSynced])

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

export default VersionList;
