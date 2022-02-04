import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ArtifactMilestoneTO, MilestoneApi } from "../../../api";
import { DeploymentInfo } from "../../../components/Deployments/DeploymentListEntry";
import { PopupToast, retryAction } from "../../../components/Form/PopupToast";
import ScreenSectionHeader from "../../../components/Header/ScreenSectionHeader";
import { loadRepositoryArtifacts } from "../../../store/RepositoryArtifactState";
import { loadRepositoryDeployments } from "../../../store/RepositoryDeploymentState";
import { loadRepositories } from "../../../store/RepositoryState";
import { RootState } from "../../../store/Store";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { makeErrorToast } from "../../../util/ToastUtils";
import DeploymentListWrapper from "../../../components/Deployments/DeploymentListWrapper";

interface Props {
    search: string;
    loadKey: number;
    onChange: () => void;
    repositoryId: string;
}

const RepositoryDeploymentSection: React.FC<Props> = props => {
    const dispatch = useDispatch();

    const { t } = useTranslation("common");

    const [milestones, setMilestones] = useState<ArtifactMilestoneTO[]>([]);

    const repositories = useSelector((state: RootState) => state.repositories);
    const repositoryArtifacts = useSelector((state: RootState) => state.repositoryArtifacts.values[props.repositoryId]);
    const repositoryDeployments = useSelector((state: RootState) => state.repositoryDeployments.values[props.repositoryId]);

    const loadMilestones = useCallback(async () => {
        if (!repositoryDeployments?.value || repositoryDeployments.value.length === 0) {
            return;
        }

        const ids = repositoryDeployments.value.map(deployment => deployment.id);
        const response = await apiExec(MilestoneApi, api => api.getAllByDeploymentIds(ids));
        if (hasFailed(response)) {
            makeErrorToast(t(response.error));
            return;
        }

        setMilestones(response.result);
    }, [t, repositoryDeployments?.value]);

    useEffect(() => {
        loadMilestones();
    }, [loadMilestones, repositoryDeployments?.value]);

    const deployments: DeploymentInfo[] = useMemo(() => (repositoryDeployments?.value || []).map(deployment => {
        const artifact = repositoryArtifacts?.value?.find(a => a.id === deployment.artifactId);
        const milestone = milestones.find(m => m.deployments.find(d => d.id === deployment.id));
        const repository = repositories.value?.find(r => r.id === deployment.repositoryId);
        return {
            deployment: deployment,
            artifact: artifact ? {
                ...artifact,
                favorite: false,
                repository: repository
            } : undefined,
            milestone: milestone
        };
    }).sort((a: DeploymentInfo, b: DeploymentInfo) => {
        // sort descending
        if (a.deployment.timestamp < b.deployment.timestamp) {
            return 1;
        }
        else if (a.deployment.timestamp > b.deployment.timestamp) {
            return -1;
        }
        return 0;
    }), [milestones, repositoryArtifacts, repositoryDeployments, repositories]);

    useEffect(() => {
        dispatch(loadRepositories());
        if (props.repositoryId) {
            dispatch(loadRepositoryDeployments(props.repositoryId));
            dispatch(loadRepositoryArtifacts(props.repositoryId));
        }
    }, [dispatch, props.repositoryId]);

    // Reload if something changed in the other sections
    useEffect(() => {
        if (props.loadKey > 0) {
            dispatch(loadRepositories(true));
        }
        if (props.loadKey > 0 && props.repositoryId) {
            dispatch(loadRepositoryDeployments(props.repositoryId, true));
            dispatch(loadRepositoryArtifacts(props.repositoryId, true));
        }
    }, [dispatch, props.loadKey, props.repositoryId]);

    /**
     * Fetch the repository deployments api
     */
    const reloadDeployments = useCallback((repositoryId: string) => {
        // callback is called every 3 seconds
        // TODO is there a better way to detect deployment changes
        dispatch(loadRepositoryDeployments(repositoryId, true));
    }, [dispatch]);

    if (repositories.error || repositoryArtifacts?.error || repositoryDeployments?.error) {
        return (
            <PopupToast
                message={t("exception.loadingError")}
                action={retryAction(() => {
                    repositories.error && dispatch(loadRepositories(true));
                    if (props.repositoryId) {
                        repositoryArtifacts?.error && dispatch(loadRepositoryArtifacts(props.repositoryId, true));
                        repositoryDeployments?.error && dispatch(loadRepositoryDeployments(props.repositoryId, true));
                    }
                })} />
        );
    }

    if (props.search) {
        // TODO: Should we display search results instead?
        return null;
    }

    if (repositoryDeployments?.value?.length === 0) {
        return null;
    }

    return (
        <>
            <ScreenSectionHeader title={t("repository.deployments")} />
            <DeploymentListWrapper
                repositoryId={props.repositoryId}
                deployments={deployments}
                doReloadDeployments={reloadDeployments} />
        </>
    );
};

export default RepositoryDeploymentSection;
