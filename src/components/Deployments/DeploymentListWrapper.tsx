import React, { useCallback, useEffect, useState } from "react";
import { DeploymentInfo } from "./DeploymentListEntry";
import CustomPagination from "../List/CustomPagination";
import { usePagination } from "../List/usePagination";
import DeploymentList from "./DeploymentList";
import {makeSuccessToast} from "../../util/ToastUtils";
import {downloadFile} from "../../util/FileUtils";
import {useTranslation} from "react-i18next";

interface Props {
    repositoryId: string;
    deployments: DeploymentInfo[];
    doReloadDeployments: (repositoryId: string) => void;
}

const DeploymentListWrapper: React.FC<Props> = (props: Props) => {

    const [retries, setRetries] = useState(1);

    /**
     * If props.deployments change check if any deployments status is PENDING and trigger reload of deployments
     * It uses an exponential backoff (10^x) and does 3 retries to avoid server issues.
     *
     * NOTE: New deployments always start with the status PENDING.
     * The status changes to SUCCESS or ERROR if the deployments finishes.
     */
    useEffect(() => {
        if (props.deployments.find(deployment => deployment.deployment.status === "PENDING") && retries < 4) {
            // reload every 10, 100, 1000 seconds
            const time = 10 ** retries;
            const timer = setTimeout(() => {
                props.doReloadDeployments(props.repositoryId)
                setRetries(retries + 1);
            }, time * 1000);
            return () => clearTimeout(timer);
        }
    }, [retries, props]);

    const { t } = useTranslation("common");
    /**
     * Downloads artifact of the deployment
     */
    const download = useCallback( async (deployment: DeploymentInfo) => {
        const milestone = deployment.milestone;
        if(!milestone) {
            return;
        }
        downloadFile(milestone);
        makeSuccessToast(t("artifact.downloadStarted"));
    },[t] );


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
