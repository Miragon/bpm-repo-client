import React, { useCallback, useEffect, useState } from "react";
import { DeploymentInfo } from "./DeploymentListEntry";
import Pagination from "../List/Pagination";
import { usePagination } from "../List/usePagination";
import DeploymentList from "./DeploymentList";

interface Props {
    repositoryId: string;
    deployments: DeploymentInfo[];
    doReloadDeployments: (repositoryId: string) => void;
}

const DeploymentListWrapper: React.FC<Props> = (props: Props) => {
    const [reloadDeployments, setReloadDeployments] = useState<boolean>(false);

    /**
     * If props.deployments change check if any deployments status is PENDING
     * and trigger reload of deployments (after waiting for 3 seconds)
     * by setting reloadDeployments state to true.
     *
     * NOTE: New deployments always start with the status PENDING.
     * The status changes to SUCCESS or ERROR if the deployments finishes.
     */
    useEffect(() => {
        let isPending = false;
        props.deployments.forEach(deployment => {
            if (deployment.deployment.status === "PENDING") {
                isPending = true;
            }
        });
        const timer = setTimeout(() => setReloadDeployments(isPending), 3000);
        return () => clearTimeout(timer);
    }, [props.deployments]);

    /**
     *  Trigger reload of deployments in parent component if the reloadDeployments state is true
     */
    useEffect(() => {
        if (reloadDeployments) {
            props.doReloadDeployments(props.repositoryId)
            setReloadDeployments(false);
        }
    }, [props, reloadDeployments]);

    /**
     * Downloads artifact of the deployment
     */
    const download = useCallback((deployment: DeploymentInfo) => {
        const filePath = `/api/milestone/${deployment.artifact?.id}/${deployment.milestone?.id}/download`;
        const link = document.createElement("a");
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
        link.click();
    }, []);

    const { pageItems, paginationConfig } = usePagination(props.deployments, 5);

    return (
        <>
            <DeploymentList
                deployments={pageItems}
                fallback="repository.noDeployments"
                onDownloadClick={download} />
            <Pagination config={paginationConfig} />
        </>
    );
};

export default DeploymentListWrapper;
