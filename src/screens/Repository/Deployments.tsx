import {ArtifactTO, DeploymentTO} from "../../api";
import {useCallback, useEffect, useState} from "react";
import {getAllDeploymentsFromRepository} from "../../store/actions";
import helpers from "../../util/helperFunctions";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import DeploymentEntry from "./DeploymentEntry";


interface Props {
    artifacts: Array<ArtifactTO>;
    repositoryId: string;
}

const Deployments: React.FC<Props> = props => {
    const {t} = useTranslation("common");
    const dispatch = useDispatch();

    const [deployments, setDeployments] = useState<Array<DeploymentTO>>([])

    const fetchDeployments = useCallback(() => {
        getAllDeploymentsFromRepository(props.repositoryId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                setDeployments(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchDeployments())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchDeployments())

        })
    }, [props.repositoryId, t])

    //Alle Versionen müssen hier gefetcht werden -> List der VersionsIds ist in Deployments


    useEffect(() => {
        fetchDeployments()
    }, [fetchDeployments])

    const getArtifactFromList = (artifactId: string) => {
        return props.artifacts.find(artifact => artifact.id === artifactId)
    }

    return (
        <>
            {deployments.map(deployment => (
                <DeploymentEntry 
                    deployment={deployment}
                    artifact={getArtifactFromList(deployment.artifactId)} />
            )
            )}
        </>
    )
}

export default Deployments;