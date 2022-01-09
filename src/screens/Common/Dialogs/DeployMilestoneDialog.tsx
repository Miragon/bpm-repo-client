import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { LocalShippingOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactMilestoneTO, DeploymentApi } from "../../../api";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsSelect from "../../../components/Form/SettingsSelect";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { makeSuccessToast } from "../../../util/ToastUtils";

interface Props {
    open: boolean;
    targets: string[];
    onClose: (deployed: boolean) => void;
    milestone: ArtifactMilestoneTO | undefined;
}

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

const DeployMilestoneDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { milestone, onClose, open, targets } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [target, setTarget] = useState("");

    const onDeploy = useCallback(async () => {
        if (!milestone) {
            return;
        }

        if (!target) {
            setError(t("validation.noTarget"));
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(DeploymentApi, api => api.deployMilestone({
            milestoneId: milestone.id,
            repositoryId: milestone.repositoryId,
            artifactId: milestone.artifactId,
            target: target
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        makeSuccessToast("milestone.deployed");
        setTarget("");
        onClose(true);
    }, [milestone, target, onClose, t]);

    return (
        <PopupDialog
            small
            icon={<LocalShippingOutlined className={classes.icon} />}
            onClose={() => onClose(false)}
            open={open}
            title={t("milestone.deploy")}
            error={error}
            disabled={disabled}
            onCloseError={() => setError(undefined)}
            firstTitle={t("milestone.deploy")}
            onFirst={onDeploy}>

            <SettingsSelect
                disabled={disabled}
                label={t("properties.target")}
                value={target}
                onChanged={setTarget}>
                <MenuItem value=""><em>{t("properties.noTarget")}</em></MenuItem>
                {targets.map(target => (
                    <MenuItem
                        key={target}
                        value={target}>
                        {target}
                    </MenuItem>
                ))}
            </SettingsSelect>

        </PopupDialog>
    );
};

export default DeployMilestoneDialog;
