import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactMilestoneTO, ArtifactTO, DeploymentTO } from "../../api";
import { getAllByDeploymentId, getAllDeploymentsFromRepository } from "../../store/actions";
import DeploymentEntry from "./DeploymentEntry";
import { makeErrorToast } from "../../util/toastUtils";
import { compareTimestamp } from "../../util/compareUtils";

interface Props {
    artifacts: Array<ArtifactTO>;
    repositoryId: string;
}

const Deployments: React.FC<Props> = props => {
    const { t } = useTranslation("common");
    const [deployments, setDeployments] = useState<Array<DeploymentTO>>([]);
    const [milestones, setMilestones] = useState<Array<ArtifactMilestoneTO>>([]);

    const fetchMilestones = useCallback((deploymentIds: Array<string>) => {
        getAllByDeploymentId(deploymentIds).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setMilestones(response.data);
            } else {
                makeErrorToast(t(response.data.toString()), () => fetchMilestones(deploymentIds));
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchMilestones(deploymentIds));
        });
    }, [t]);

    const fetchDeployments = useCallback(() => {
        getAllDeploymentsFromRepository(props.repositoryId).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                setDeployments(response.data.sort(compareTimestamp));
                const deploymentIds = response.data.map(deployment => deployment.id);
                if (deploymentIds.length > 0) {
                    fetchMilestones(deploymentIds);
                }
            } else {
                makeErrorToast(t(response.data.toString()), () => fetchDeployments());
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => fetchDeployments());
        });
    }, [fetchMilestones, props.repositoryId, t]);

    // fetch all deployments

    useEffect(() => {
        fetchDeployments();
    }, [fetchDeployments]);

    const getArtifactFromList = (artifactId: string) => {
        return props.artifacts.find(artifact => artifact.id === artifactId);
    };

    const getMilestoneFromList = (deploymentId: string) => {
        return milestones.find(milestone => milestone.deployments.find(deployment => deployment.id === deploymentId));
    };

    return (
        <>
            {deployments.map(deployment => (
                <DeploymentEntry
                    key={deployment.id}
                    deployment={deployment}
                    milestone={getMilestoneFromList(deployment.id)}
                    artifact={getArtifactFromList(deployment.artifactId)} />
            ))}

            {
                deployments.length === 0
                    && (
                        <div>
                            {t("deployment.notAvailable")}
                        </div>
                    )
            }
        </>
    );
};

export default Deployments;
