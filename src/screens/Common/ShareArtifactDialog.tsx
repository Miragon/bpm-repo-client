import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { ShareOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { RepositoryTO, ShareApi, ShareWithRepositoryTORoleEnum } from "../../api";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import PopupDialog from "../../components/Shared/Form/PopupDialog";
import SettingsSelect from "../../components/Shared/Form/SettingsSelect";
import { apiExec, hasFailed } from "../../util/ApiUtils";
import helpers from "../../util/helperFunctions";

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
            setError("Kein Projekt gewählt!");
            return;
        }

        if (!role) {
            setError("Keine Rolle gewählt!");
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

        helpers.makeSuccessToast(t("share.successful"));
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
                label={t("repository.target")}
                onChanged={setRepositoryId}>
                <MenuItem value="">
                    <em>Kein Projekt ausgewählt</em>
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
                label="Rolle"
                onChanged={setRole}>
                <MenuItem value="">
                    <em>Keine Rolle ausgewählt</em>
                </MenuItem>
                <MenuItem value={ShareWithRepositoryTORoleEnum.Viewer}>
                    Betrachter
                </MenuItem>
                <MenuItem value={ShareWithRepositoryTORoleEnum.Member}>
                    Mitglied
                </MenuItem>
                <MenuItem value={ShareWithRepositoryTORoleEnum.Admin}>
                    Administrator
                </MenuItem>
                <MenuItem value={ShareWithRepositoryTORoleEnum.Owner}>
                    Besitzer
                </MenuItem>
            </SettingsSelect>

        </PopupDialog>
    );
};
export default ShareArtifactDialog;
