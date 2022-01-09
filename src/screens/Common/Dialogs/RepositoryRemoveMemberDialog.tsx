import { makeStyles } from "@material-ui/core/styles";
import { DeleteOutlineOutlined } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { RepoAssignmentApi, RepositoryTO } from "../../../api";
import { UserInfo } from "../../../components/Users/UserListEntry";
import PopupDialog from "../../../components/Form/PopupDialog";
import { apiExec, hasFailed } from "../../../util/ApiUtils";

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    }
});

interface Props {
    open: boolean;
    onClose: (removed: boolean) => void;
    user: UserInfo | undefined;
    repository: RepositoryTO | undefined;
}

const RepositoryRemoveMemberDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { repository, user, open, onClose } = props;

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();

    const remove = useCallback(async () => {
        if (!repository || !user) {
            return;
        }

        setDisabled(true);
        const response = await apiExec(RepoAssignmentApi, api => api.deleteUserAssignment(repository.id, user.id));
        setDisabled(false);

        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        onClose(true);
    }, [repository, t, onClose, user]);

    const onCancel = () => {
        onClose(false);
    };

    return (
        <PopupDialog
            small
            danger
            error={error}
            disabled={disabled}
            icon={<DeleteOutlineOutlined className={classes.icon} />}
            onClose={onCancel}
            onCloseError={() => setError(undefined)}
            open={open}
            firstTitle={t("repository.members.remove")}
            onFirst={remove}
            title={t("repository.members.remove")}>

            {t("repository.members.confirmRemove")}

        </PopupDialog>
    );
};

export default RepositoryRemoveMemberDialog;
