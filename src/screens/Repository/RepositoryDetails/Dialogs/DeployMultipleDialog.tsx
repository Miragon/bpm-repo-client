import React, {useCallback, useEffect, useState} from "react";
import PopupDialog from "../../../../components/Form/PopupDialog";
import {List, MenuItem, Paper} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ArtifactTO, NewDeploymentTO} from "../../../../api";
import {SYNC_STATUS_TARGETS, SYNC_STATUS_VERSION, TARGETS} from "../../../../constants/Constants";
import {RootState} from "../../../../store/reducers/rootReducer";
import {deployMultiple, fetchTargets} from "../../../../store/actions";
import helpers from "../../../../util/helperFunctions";
import AddDeploymentSearchBar from "./AddDeploymentSearchBar";
import DeploymentListItem from "./DeploymentListItem";
import SettingsSelect from "../../../../components/Form/SettingsSelect";
import SettingsForm from "../../../../components/Form/SettingsForm";


interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
}

//TODO: wenn in einem listItem keine Version ausgewählt wird, kann die Liste trotzdem deployt werden (alle elemente außer das ohne Version werden dann deplyot)
const DeployMultipleDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const targetsSynced: boolean = useSelector((state: RootState) => state.dataSynced.targetsSynced)
    const targets: Array<string> = useSelector((state: RootState) => state.deployment.targets)


    const [error, setError] = useState<string | undefined>(undefined);
    const [deployments, setDeployments] = useState<Array<NewDeploymentTO>>([]);
    const [artifacts, setArtifacts] = useState<ArtifactTO[]>([]);
    const [target, setTarget] = useState<string>("");


    const getTargets = useCallback(async () => {
        fetchTargets().then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({type: TARGETS, targets: response.data})
                dispatch({type: SYNC_STATUS_TARGETS, targetsSynced: true})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getTargets())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getTargets())
        })
    }, [dispatch, t])

    useEffect(() => {
        if(!targetsSynced){
            getTargets()
        }
    }, [getTargets, targetsSynced])

    const addArtifact = (artifact: ArtifactTO | undefined) => {
        if(artifact){
            artifacts.push(artifact)
            setArtifacts([...artifacts])
        }
    }

    //manages an array of NewDeploymentTOs
    // - adds one NewDeploymentTO if it is not yet part of the array
    // - removes an NewDeploymentTO and adds another NewDeploymentTO, if user changes the version that should be deployed
    const onChangeMilestone = (artifactId: string, versionId: string) => {
        const newDeploymentTOs = deployments
        const newDeploymentTO: NewDeploymentTO = {artifactId, versionId, target}
        const updatedDeployment = newDeploymentTOs.find(deploymentTOs => deploymentTOs.artifactId === artifactId)
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


    const onCancel = () => {
        setArtifacts([])
        props.onCancelled()
    }

    return (
        <PopupDialog
            open={props.open}
            title={t("deployment.multiple")}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("dialog.deploy")}
            onFirst={deploy}
            secondTitle={t("dialog.close")}
            onSecond={onCancel}>
            <SettingsForm large>
                <SettingsSelect
                    disabled={false}
                    label={t("deployment.target")}
                    value={target}
                    onChanged={setTarget}>
                    {targets.map(target => (
                        <MenuItem key={target} value={target}>{target}</MenuItem>
                    ))}

                </SettingsSelect>
            </SettingsForm>
            <List dense={false}>
                <AddDeploymentSearchBar key="AddDeploymentSearchBar" addedArtifacts={artifacts} repoId={props.repoId} addArtifact={(artifact: ArtifactTO | undefined) => addArtifact(artifact)}/>
                <Paper>
                    {artifacts.map(artifact => (
                        <DeploymentListItem
                            key={artifact.id}
                            artifactId={artifact.id}
                            artifactName={artifact.name}
                            onChangeMilestone={(artifactId: string, versionId: string) => onChangeMilestone(artifactId, versionId)} />
                    ))}


                </Paper>

            </List>
        </PopupDialog>    );
}
export default DeployMultipleDialog;