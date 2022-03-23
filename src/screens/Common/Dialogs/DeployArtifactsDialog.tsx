import { Checkbox, FormControlLabel, MenuItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { LocalShippingOutlined } from "@material-ui/icons";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeploymentApi, NewDeploymentTO } from "../../../api";
import { FileDescription } from "../../../components/Files/FileListEntry";
import PopupDialog from "../../../components/Form/PopupDialog";
import SearchTextField from "../../../components/Form/SearchTextField";
import SettingsForm from "../../../components/Form/SettingsForm";
import SettingsSelect from "../../../components/Form/SettingsSelect";
import { apiExec, hasFailed } from "../../../util/ApiUtils";
import { filterArtifactList } from "../../../util/SearchUtils";
import { makeSuccessToast } from "../../../util/ToastUtils";

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
        return filterArtifactList(search, props.artifacts);
    }, [props.artifacts, search]);

    const deploy = useCallback(async () => {
        if (!target) {
            setError(t("validation.noTarget"));
            return;
        }

        if (selectedArtifacts.length === 0) {
            setError(t("validation.noArtifacts"));
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
            setError(t(response.error));
            return;
        }

        props.onClose(true);
        setTarget("");
        setSearch("");
        setSelectedArtifacts([]);
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
            title={t("milestone.deployMultiple")}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("milestone.deployMultiple")}
            onFirst={deploy}>
            <SettingsForm large>
                <SettingsSelect
                    disabled={disabled}
                    label={t("properties.target")}
                    value={target}
                    onChanged={setTarget}>
                    <MenuItem value=""><em>{t("properties.noTarget")}</em></MenuItem>
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
                        label={t("milestone.search")}
                        search={search}
                        onSearchChanged={setSearch} />
                </div>
                <div className={classes.list}>
                    {filteredArtifacts.length === 0 && (
                        <Typography
                            variant="body1"
                            className={classes.placeholder}>
                            {t("milestone.noneFound")}
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
