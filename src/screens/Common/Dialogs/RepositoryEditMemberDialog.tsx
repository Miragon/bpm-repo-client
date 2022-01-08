import { MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { EditOutlined } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AssignmentTORoleEnum, RepoAssignmentApi, RepositoryTO } from "../../../api";
import { UserInfo } from "../../../components/Layout/Users/UserListEntry";
import PopupDialog from "../../../components/Shared/Form/PopupDialog";
import SettingsSelect from "../../../components/Shared/Form/SettingsSelect";
import { apiExec, hasFailed } from "../../../util/ApiUtils";

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

interface Props {
    open: boolean;
    onClose: (edited: boolean) => void;
    user: UserInfo | undefined;
    repository: RepositoryTO | undefined;
}

const RepositoryEditMemberDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { repository, user, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [role, setRole] = useState<AssignmentTORoleEnum | "">("");

    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user]);

    const edit = useCallback(async () => {
        if (!repository || !user) {
            return;
        }

        if (!role) {
            setError("Keine Rolle ausgewählt!");
            return;
        }

        setDisabled(true);
        const response = await apiExec(RepoAssignmentApi, api => api.updateUserAssignment({
            repositoryId: repository.id,
            role: role,
            userId: user.id
        }));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        onClose(true);
    }, [role, repository, t, onClose, user]);

    const onCancel = () => {
        onClose(false);
    };

    return (
        <PopupDialog
            small
            error={error}
            disabled={disabled}
            icon={<EditOutlined className={classes.icon} />}
            onClose={onCancel}
            onCloseError={() => setError(undefined)}
            open={open}
            title="Rolle bearbeiten"
            onFirst={edit}
            firstTitle={t("dialog.applyChanges")}>

            <SettingsSelect
                disabled={false}
                label="Neue Rolle"
                value={role}
                onChanged={setRole}>
                <MenuItem value=""><em>Keine Rolle ausgewählt</em></MenuItem>
                <MenuItem value={AssignmentTORoleEnum.Viewer}>Betrachter</MenuItem>
                <MenuItem value={AssignmentTORoleEnum.Member}>Mitglied</MenuItem>
                <MenuItem value={AssignmentTORoleEnum.Admin}>Administrator</MenuItem>
                <MenuItem value={AssignmentTORoleEnum.Owner}>Eigentümer</MenuItem>

            </SettingsSelect>

        </PopupDialog>
    );
};

export default RepositoryEditMemberDialog;
