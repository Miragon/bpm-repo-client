import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { ShareOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { RepositoryTO, ShareApi, ShareWithRepositoryTORoleEnum } from "../../../api";
import { FileDescription } from "../../../components/Files/FileListEntry";
import PopupDialog from "../../../components/Form/PopupDialog";
import SettingsSelect from "../../../components/Form/SettingsSelect";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { makeSuccessToast } from "../../../util/ToastUtils";

interface Props {
    open: boolean;
    artifact: FileDescription | undefined;
    ownRepositories: RepositoryTO[];
    onClose: (shared: boolean) => void;
}

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

const ShareArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [repositoryId, setRepositoryId] = useState("");
    const [role, setRole] = useState<ShareWithRepositoryTORoleEnum | "">("");

    const onShare = useCallback(async () => {
        const artifact = props.artifact;

        if (!artifact) {
            return;
        }

        if (!repositoryId) {
            setError(t("validation.noRepository"));
            return;
        }

        if (!role) {
            setError(t("validation.noRole"));
            return;
        }

        setError(undefined);
        setDisabled(true);
        const response = await apiExec(ShareApi, api => api.shareWithRepository({
            artifactId: artifact.id,
            role: role,
            repositoryId: repositoryId
        }));
        setDisabled(false);
        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        makeSuccessToast(t("artifact.shared"));
        setRole("");
        setRepositoryId("");
        props.onClose(true);
    }, [t, props, repositoryId, role]);

    return (
        <PopupDialog
            small
            disabled={disabled}
            icon={<ShareOutlined className={classes.icon} />}
            onClose={() => props.onClose(false)}
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.share")}
            firstTitle={t("artifact.share")}
            onFirst={onShare}>

            <SettingsSelect
                disabled={disabled}
                value={repositoryId}
                label={t("properties.repository")}
                onChanged={setRepositoryId}>
                <MenuItem value="">
                    <em>{t("properties.noRepository")}</em>
                </MenuItem>
                {props.ownRepositories.map(repo => (
                    <MenuItem
                        key={repo.id}
                        value={repo.id}>
                        {repo.name}
                    </MenuItem>
                ))}
            </SettingsSelect>

            <SettingsSelect
                disabled={disabled}
                value={role}
                label={t("properties.role")}
                onChanged={setRole}>
                <MenuItem value="">
                    <em>{t("properties.noRole")}</em>
                </MenuItem>
                <MenuItem value={ShareWithRepositoryTORoleEnum.Viewer}>
                    {t("role.viewer")}
                </MenuItem>
                <MenuItem value={ShareWithRepositoryTORoleEnum.Member}>
                    {t("role.member")}
                </MenuItem>
                <MenuItem value={ShareWithRepositoryTORoleEnum.Admin}>
                    {t("role.admin")}
                </MenuItem>
                <MenuItem value={ShareWithRepositoryTORoleEnum.Owner}>
                    {t("role.owner")}
                </MenuItem>
            </SettingsSelect>

        </PopupDialog>
    );
};
export default ShareArtifactDialog;
