import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DeploymentListEntry, { DeploymentInfo } from "./DeploymentListEntry";

interface Props {
    deployments: DeploymentInfo[];
    fallback: string;
    className?: string;
    onDownloadClick: (deployment: DeploymentInfo) => void;
}

const DeploymentList: React.FC<Props> = (props: Props) => {
    const { t } = useTranslation("common");

    const {
        fallback,
        onDownloadClick,
        deployments,
        className
    } = props;

    // Make sure this component is re-rendered every 60 seconds to update the view and the times
    const [, setRenderKey] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setRenderKey(cur => cur + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={className}>
            {deployments.length === 0 && (
                <Typography variant="body1">
                    {t(fallback)}
                </Typography>
            )}
            {deployments.map(deployment => (
                <DeploymentListEntry
                    key={deployment.deployment.id}
                    deployment={deployment}
                    onDownloadClick={() => onDownloadClick(deployment)} />
            ))}
        </div>
    );
};

export default DeploymentList;
