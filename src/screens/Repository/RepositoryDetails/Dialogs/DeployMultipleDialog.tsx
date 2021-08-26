import React, {useCallback, useEffect, useMemo, useState} from "react";
import PopupDialog from "../../../../components/Form/PopupDialog";
import {List, Paper} from "@material-ui/core";
import AddUserSearchBar from "./AddUserSearchBar";
import UserListItem from "./UserListItem";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ArtifactTO, ArtifactVersionTO, AssignmentTO, AssignmentTORoleEnum, NewDeploymentTO} from "../../../../api";
import {
    DEPLOYMENT_VERSIONS,
    HANDLEDERROR,
    SYNC_STATUS_ACTIVE_REPOSITORY,
    SYNC_STATUS_VERSION
} from "../../../../constants/Constants";
import {RootState} from "../../../../store/reducers/rootReducer";
import {deployMultiple, getAllVersions} from "../../../../store/actions";
import helpers from "../../../../util/helperFunctions";
import AddDeploymentSearchBar from "./AddDeploymentSearchBar";
import DeploymentListItem from "./DeploymentListItem";


interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
}


const DeployMultipleDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const assignedUsers: Array<AssignmentTO> = useSelector((state: RootState) => state.user.assignedUsers);
    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo);
    const activeArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.artifacts);
    const deploymentVersions: Array<Array<ArtifactVersionTO>> = useSelector((state: RootState) => state.versions.deploymentVersions)

    const [error, setError] = useState<string | undefined>(undefined);
    const [hasAdminPermissions, setHasAdminPermissions] = useState<boolean>(false);
    const [deployments, setDeployments] = useState<Array<NewDeploymentTO>>([]);
    const [artifacts, setArtifacts] = useState<Array<ArtifactTO>>([]);
    const [target, setTarget] = useState<string>("production");


    useEffect(() => {
        console.log("useeffect")
        console.log(artifacts)
    }, [artifacts])

    const addArtifact = (artifact: ArtifactTO | undefined) => {
        console.log("stg")
        if(artifact){
            getVersions(artifact.id)
            console.log("adding " + artifact.id)
            const currentArtifacts: Array<ArtifactTO> = artifacts
            currentArtifacts.push(artifact)
            setArtifacts(currentArtifacts)
        }
    }

    //TODO: Maybe move to deploymentListItem
    const getVersions = useCallback(async (artifactId: string) => {
        getAllVersions(artifactId).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                dispatch({type: DEPLOYMENT_VERSIONS, deploymentVersions: response.data})
                //TODO allow the user to deploy all selected versions, as soon as this request has finished
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getVersions(artifactId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getVersions(artifactId))
        })
    }, [dispatch, t])

    /*
    Deployment: artifactId, versionId, target

    // send request that fetches all versions of all selected Artifacts

//DeploymentListItem hat eine ArtifactId und in seinem eigenen State die zu veröffentlichende Version -> funktion in Props für ChangeVersion
    const buildNewDeploymentTOs = () => {

    }
         */


    //Läuft in die falsche Richtung, Meilenstein muss in Listitem gespeichert sein

    /*
    useEffect(() => {
        const deploymentTOs = deployments;
        //DeploymentVersions enthält einen verschachteteln Array, der alle Versionen der zu veröffentlichen Artifacts enthält
        //Im State musas zusätzlich gespeichert werden, welcher meilenstein der jeweiligen Artifacts veröffentlicht werden soll
        deploymentVersions.map(versions => {
            console.log("in use")
            console.log(versions.filter(version => version.milestone === 1))
            const requestedVersion = versions.filter(version => version.milestone === 1)[0];
            const newDeploymentTO: NewDeploymentTO = {
                artifactId: requestedVersion.artifactId,
                versionId: requestedVersion.id,
                target: target
            }
        })
        console.log(deploymentTOs)
    }, [deploymentVersions])
*/

    const onChangeMilestone = (milestone: number, artifactId: string, versionId: string) => {
        const newDeploymentTOs = deployments
        const newDeploymentTO: NewDeploymentTO = {artifactId, versionId, target}
        const updatedDeployment = newDeploymentTOs.filter(deploymentTOs => deploymentTOs.artifactId === artifactId)
        if(updatedDeployment){
            const updatedList = newDeploymentTOs.filter(deploymentTOs => deploymentTOs.artifactId !== artifactId)
            const newDeploymentTO: NewDeploymentTO = {artifactId, versionId, target}
            updatedList.push(newDeploymentTO)
            setDeployments(updatedList)
        } else {
            newDeploymentTOs.push(newDeploymentTO)
            setDeployments(newDeploymentTOs)
        }
    }

    const deploy = useCallback(async () => {
        deployMultiple(deployments).then(response => {
            if(Math.floor(response.status / 100) === 2) {
                helpers.makeSuccessToast(t("deployment.deployedMultiple", {deployedVersions: response.data.length}))
                dispatch({type: SYNC_STATUS_VERSION, dataSynced: false});
                props.onCancelled()
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => deploy())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => deploy())

        })
    }, [deployments, dispatch, props, t])


    const checkForAdminPermissions = useMemo(() => {
        const currentUserAssignment = assignedUsers
            .find(assignmentTO => assignmentTO.username === currentUser.username);
        try {
            if (currentUserAssignment?.role === AssignmentTORoleEnum.Admin
                || currentUserAssignment?.role === AssignmentTORoleEnum.Owner) {
                setHasAdminPermissions(true);
                return true;
            }
            setHasAdminPermissions(false);
            return false;
        } catch (err) {
            dispatch({
                type: HANDLEDERROR,
                message: "Error while checking permissions for this repository"
            });
            return false;
        }
    }, [assignedUsers, currentUser, dispatch]);


    return (
        <PopupDialog
            open={props.open}
            title={t("deployment.multiple")}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("dialog.deploy")}
            onFirst={deploy}
            secondTitle={t("dialog.close")}
            onSecond={props.onCancelled}>
            <List dense={false}>
                {checkForAdminPermissions ? (
                    <AddDeploymentSearchBar repoId={props.repoId} addArtifact={(artifact: ArtifactTO | undefined) => addArtifact(artifact)}/>
                )
                    :
                    <p>
                        {t("deployment.adminPermissionsRequired")}
                    </p>
                }
                <Paper>
                    {artifacts.map(artifact => (
                        <DeploymentListItem
                            key={artifact.id}
                            artifactId={artifact.id}
                            artifactName={artifact.name}
                            onChangeMilestone={(milestone: number, artifactId: string, versionId: string) => onChangeMilestone(milestone, artifactId, versionId)} />
                    ))}


                </Paper>

            </List>
        </PopupDialog>    );
}
export default DeployMultipleDialog;