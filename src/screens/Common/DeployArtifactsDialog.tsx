import { Checkbox, FormControlLabel, MenuItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LocalShippingOutlined } from "@material-ui/icons";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeploymentApi, NewDeploymentTO } from "../../api";
import { FileDescription } from "../../components/Layout/Files/FileListEntry";
import PopupDialog from "../../components/Shared/Form/PopupDialog";
import SearchTextField from "../../components/Shared/Form/SearchTextField";
import SettingsForm from "../../components/Shared/Form/SettingsForm";
import SettingsSelect from "../../components/Shared/Form/SettingsSelect";
import { apiExec, hasFailed } from "../../util/ApiUtils";
import helpers from "../../util/helperFunctions";

const useStyles = makeStyles(() => ({
    wrapper: {},
    list: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid #CCC",
        borderRadius: "4px",
        height: "400px",
        overflowY: "auto"
    },
    root: {
        padding: "4px 16px 4px 8px",
        margin: 0,
        borderBottom: "1px solid #CCC"
    },
    search: {
        display: "flex",
        marginBottom: "8px",
    },
    searchField: {
        flexGrow: 1
    },
    placeholder: {
        padding: "16px",
        color: "rgba(0, 0, 0, 0.38)"
    },
    icon: {
        fontSize: "3rem",
        color: "white"
    }
}));

interface Props {
    open: boolean;
    onClose: (deployed: boolean) => void;
    repositoryId: string;
    artifacts: FileDescription[];
    targets: string[];
}

const DeployArtifactsDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<string>();
    const [target, setTarget] = useState("");
    const [search, setSearch] = useState("");
    const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);

    const onArtifactSelected = useCallback((selectedArtifact: string, checked: boolean) => {
        if (checked) {
            setSelectedArtifacts(cur => cur.concat(selectedArtifact));
        } else {
            setSelectedArtifacts(cur => cur.filter(artifact => artifact !== selectedArtifact));
        }
    }, []);

    const filteredArtifacts = useMemo(() => {
        return props.artifacts.filter(a => a.name.toLowerCase().indexOf(search) !== -1);
    }, [props.artifacts, search]);

    const deploy = useCallback(async () => {
        if (!target) {
            setError("Keine Zielumgebung ausgewählt!");
            return;
        }

        if (selectedArtifacts.length === 0) {
            setError("Keine Dateien ausgewählt!");
            return;
        }

        setError(undefined);
        const deployments: NewDeploymentTO[] = selectedArtifacts.map(artifact => ({
            target: target,
            repositoryId: props.repositoryId,
            artifactId: artifact,
            milestoneId: "latest"
        }));

        setDisabled(true);
        const response = await apiExec(DeploymentApi, api => api.deployMultipleMilestones(deployments));
        setDisabled(false);

        if (hasFailed(response)) {
            helpers.makeErrorToast(t(response.error));
        } else {
            helpers.makeSuccessToast(t("deployment.deployedMultiple", { deployedMilestones: response.result.length }));
            props.onClose(true);
        }
    }, [target, selectedArtifacts, props, t])

    const onCancel = () => {
        setSelectedArtifacts([]);
        props.onClose(false);
    };

    return (
        <PopupDialog
            open={props.open}
            onClose={onCancel}
            icon={<LocalShippingOutlined className={classes.icon} />}
            title={t("deployment.multiple")}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("milestone.deployMultiple")}
            onFirst={deploy}>
            <SettingsForm large>
                <SettingsSelect
                    disabled={false}
                    label={t("deployment.target")}
                    value={target}
                    onChanged={setTarget}>
                    <MenuItem value=""><em>Kein Ziel ausgewählt</em></MenuItem>
                    {props.targets.map(target => (
                        <MenuItem
                            key={target}
                            value={target}>
                            {target}
                        </MenuItem>
                    ))}
                </SettingsSelect>
            </SettingsForm>
            <div className={classes.wrapper}>
                <div className={classes.search}>
                    <SearchTextField
                        className={classes.searchField}
                        label="Dateien durchsuchen..."
                        search={search}
                        onSearchChanged={setSearch} />
                </div>
                <div className={classes.list}>
                    {filteredArtifacts.length === 0 && (
                        <Typography
                            variant="body1"
                            className={classes.placeholder}>
                            Keine Dateien gefunden.
                        </Typography>
                    )}
                    {filteredArtifacts.map(artifact => (
                        <FormControlLabel
                            key={artifact.id}
                            label={artifact.name}
                            className={classes.root}
                            control={(
                                <Checkbox
                                    disableFocusRipple
                                    disableRipple
                                    disableTouchRipple
                                    color="primary"
                                    checked={selectedArtifacts.indexOf(artifact.id) !== -1}
                                    disabled={disabled}
                                    onChange={(_, newValue) => onArtifactSelected(artifact.id, newValue)} />
                            )} />
                    ))}
                </div>
            </div>
        </PopupDialog>
    );
}
export default DeployArtifactsDialog;
