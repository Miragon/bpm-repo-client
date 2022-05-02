import React, { useCallback, useEffect } from "react";
import { DeploymentInfo } from "./DeploymentListEntry";
import CustomPagination from "../List/CustomPagination";
import { usePagination } from "../List/usePagination";
import DeploymentList from "./DeploymentList";

interface Props {
    repositoryId: string;
    deployments: DeploymentInfo[];
    doReloadDeployments: (repositoryId: string) => void;
}

const DeploymentListWrapper: React.FC<Props> = (props: Props) => {

    /**
     * If props.deployments change check if any deployments status is PENDING
     * and trigger reload of deployments (after waiting for 3 seconds)
     *
     * NOTE: New deployments always start with the status PENDING.
     * The status changes to SUCCESS or ERROR if the deployments finishes.
     */
    useEffect(() => {
        if (props.deployments.find(deployment => deployment.deployment.status === "PENDING")) {
            const timer = setTimeout(() => props.doReloadDeployments(props.repositoryId), 3000);
            return () => clearTimeout(timer);
        }
    }, [props]);

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
            <CustomPagination config={paginationConfig} />
        </>
    );
};

export default DeploymentListWrapper;
