import { MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { AddOutlined } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    AssignmentTORoleEnum,
    RepoAssignmentApi,
    RepositoryTO,
    UserApi,
    UserInfoTO
} from "../../../api";
import PopupDialog from "../../../components/Shared/Form/PopupDialog";
import SettingsSelect from "../../../components/Shared/Form/SettingsSelect";
import { apiExec, hasFailed } from "../../../util/ApiUtils";

const useStyles = makeStyles({
    icon: {
        fontSize: "3rem",
        color: "white"
    },
    input: {
        marginBottom: "1rem"
    }
});

interface Props {
    open: boolean;
    onClose: (edited: boolean) => void;
    repository: RepositoryTO | undefined;
}

let timeout: NodeJS.Timeout | undefined;

const RepositoryAddMemberDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const { repository, open, onClose } = props;

    const [options, setOptions] = useState<UserInfoTO[]>([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [role, setRole] = useState<AssignmentTORoleEnum | "">("");

    const add = useCallback(async () => {
        if (!repository) {
            return;
        }

        if (!role) {
            setError("Keine Rolle ausgewählt!");
            return;
        }

        if (!username) {
            setError("Kein Benutzer ausgewählt!");
            return;
        }

        console.log(options, username);
        const user = options.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (!user) {
            setError("Benutzer nicht gefunden!");
            return;
        }

        setDisabled(true);
        const response = await apiExec(RepoAssignmentApi, api => api.createUserAssignment({
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
    }, [options, username, role, repository, t, onClose]);

    const onCancel = () => {
        onClose(false);
    };

    const fetchUserSuggestions = useCallback(async (text: string) => {
        const response = await apiExec(UserApi, api => api.searchUsers(text.toLowerCase()));
        if (hasFailed(response)) {
            setError(t(response.error));
            return;
        }

        setLoading(false);
        setOptions(response.result);
    }, [t]);

    const onChange = (input: string) => {
        setUsername(input);
        if (input) {
            timeout && clearTimeout(timeout);
            setLoading(true);
            timeout = setTimeout(() => fetchUserSuggestions(input), 500);
        }
    };

    return (
        <PopupDialog
            small
            error={error}
            disabled={disabled}
            icon={<AddOutlined className={classes.icon} />}
            onClose={onCancel}
            onCloseError={() => setError(undefined)}
            open={open}
            title="Mitglied hinzufügen"
            onFirst={add}
            firstTitle={t("dialog.applyChanges")}>

            <Autocomplete<UserInfoTO, false, true, true>
                freeSolo
                fullWidth
                className={classes.input}
                getOptionSelected={(option, value) => option.username === value.username}
                getOptionLabel={option => option.username}
                options={options}
                loading={loading}
                onChange={(e, value) => setUsername(typeof value !== "string" ? value.username : "")}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Benutzer suchen..."
                        size="small"
                        variant="outlined"
                        onChange={event => onChange(event.target.value)}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && (
                                        <CircularProgress color="inherit" size={16} />
                                    )}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }} />
                )} />

            <SettingsSelect
                disabled={false}
                label="Rolle"
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

export default RepositoryAddMemberDialog;
