import { CircularProgress } from "@material-ui/core";
import {
    CloudDownloadOutlined,
    HistoryOutlined,
    LocalShippingOutlined,
    SaveOutlined
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactMilestoneTO, ArtifactTypeTO, MilestoneApi } from "../../../api";
import { FileDescription } from "../../../components/Files/FileListEntry";
import MilestoneList from "../../../components/Milestones/MilestoneList";
import PopupDialog from "../../../components/Form/PopupDialog";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { openFileInTool } from "../../../util/LinkUtils";
import DeployMilestoneDialog from "./DeployMilestoneDialog";
import SaveMilestoneAsDialog from "./SaveMilestoneAsDialog";

const MILESTONE_OPTIONS = [
    [
        {
            label: "milestone.deploy",
            value: "deploy-milestone",
            icon: LocalShippingOutlined
        },
        {
            label: "milestone.download",
            value: "download-milestone",
            icon: CloudDownloadOutlined
        }
    ],
    [
        {
            label: "milestone.saveAsNewArtifact",
            value: "save-as-new-artifact",
            icon: SaveOutlined
        }
    ]
];

const useStyles = makeStyles(() => ({
    icon: {
        fontSize: "3rem",
        color: "white"
    },
    loading: {
        margin: "1rem auto"
    }
}));

interface Props {
    open: boolean;
    targets: string[];
    onChanged: () => void;
    artifactTypes: ArtifactTypeTO[];
    artifact: FileDescription | undefined;
    onClose: () => void;
}

const ListMilestonesDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const {
        open, onClose, artifact, targets
    } = props;

    const [deploymentMilestone, setDeploymentMilestone] = useState<ArtifactMilestoneTO>();
    const [saveMilestone, setSaveMilestone] = useState<ArtifactMilestoneTO>();
    const [milestones, setMilestones] = useState<ArtifactMilestoneTO[]>();
    const [error, setError] = useState<string>();

    const onMenuClick = useCallback(async (action: string, milestone: ArtifactMilestoneTO) => {
        switch (action) {
            case "deploy-milestone": {
                setDeploymentMilestone(milestone);
                break;
            }
            case "download-milestone": {
                const filePath = `/api/milestone/${milestone.artifactId}/${milestone.id}/download`;
                const link = document.createElement("a");
                link.href = filePath;
                link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
                link.click();
                break;
            }
            case "save-as-new-artifact": {
                setSaveMilestone(milestone);
                break;
            }
        }
    }, []);

    const loadMilestones = useCallback(async () => {
        if (!artifact) {
            return;
        }

        setError(undefined);
        const response = await apiExec(MilestoneApi, api => api.getAllMilestones(artifact.id));
        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        setMilestones(response.result);
    }, [artifact, t]);

    useEffect(() => {
        loadMilestones();
    }, [loadMilestones]);

    return (
        <PopupDialog
            full
            error={error}
            onCloseError={loadMilestones}
            icon={<HistoryOutlined className={classes.icon} />}
            onClose={() => onClose()}
            open={open}
            title={t("milestone.list")}>

            {!milestones && (
                <CircularProgress
                    variant="indeterminate"
                    size={64}
                    className={classes.loading} />
            )}

            {milestones && (
                <MilestoneList
                    milestones={milestones}
                    fallback="milestone.noMilestones"
                    onMenuClick={onMenuClick}
                    onClick={milestone => props.artifact && openFileInTool(props.artifactTypes, props.artifact.fileType, milestone.repositoryId, milestone.artifactId, milestone.milestone)}
                    menuEntries={MILESTONE_OPTIONS} />
            )}

            <DeployMilestoneDialog
                open={!!deploymentMilestone}
                targets={targets}
                onClose={deployed => {
                    setDeploymentMilestone(undefined);
                    deployed && loadMilestones();
                }}
                milestone={deploymentMilestone} />

            <SaveMilestoneAsDialog
                open={!!saveMilestone}
                fileType={props.artifact?.fileType}
                onClose={saved => {
                    setSaveMilestone(undefined);
                    saved && props.onChanged();
                }}
                milestone={saveMilestone} />

        </PopupDialog>
    );
};

export default ListMilestonesDialog;
