import {Checkbox, FormControlLabel, MenuItem, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {ArtifactTO, NewDeploymentTO} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import {deployMultiple, fetchTargets} from "../../../store/actions";
import {SYNC_STATUS_TARGETS, SYNC_STATUS_MILESTONE, TARGETS} from "../../../constants/Constants";
import helpers from "../../../util/helperFunctions";
import PopupDialog from "../Form/PopupDialog";
import SettingsForm from "../Form/SettingsForm";
import SettingsSelect from "../Form/SettingsSelect";
import SearchTextField from "../Form/SearchTextField";

const useStyles = makeStyles(() => ({
    wrapper: {},
    list: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid #CCC",
        backgroundColor: "white",
        borderRadius: "4px",
        padding: "4px 0",
        height: "400px",
        overflowY: "auto"
    },
    root: {
        padding: "4px 16px 4px 8px",
        margin: 0,
        "&:not(:last-child)": {
            borderBottom: "1px solid #CCC"
        }
    },
    disabled: {},
    checkbox: {},
    search: {
        display: "flex",
        marginBottom: "8px",
        backgroundColor: "white"
    },
    searchField: {
        flexGrow: 1
    },
    placeholder: {
        padding: "16px",
        color: "rgba(0, 0, 0, 0.38)"
    }
}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    repoId: string;
    artifacts: ArtifactTO[];
}

//TODO: wenn in einem listItem keine MIlestone ausgewählt wird, kann die Liste trotzdem deployt
// werden (alle elemente außer das ohne MIlestone werden dann deplyot)
const DeployMultipleDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const targetsSynced: boolean = useSelector((state: RootState) => state.dataSynced.targetsSynced)
    const targets: Array<string> = useSelector((state: RootState) => state.deployment.targets)

    const [error, setError] = useState<string | undefined>(undefined);
    const [target, setTarget] = useState<string>("");

    const [search, setSearch] = useState("");
    const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);
    const disabled = false;

    const onArtifactSelected = useCallback((selectedArtifact: string, checked: boolean) => {
        if (checked) {
            setSelectedArtifacts(cur => cur.concat(selectedArtifact));
        } else {
            setSelectedArtifacts(cur => cur.filter(artifact => artifact !== selectedArtifact));
        }
    }, []);

    const getTargets = useCallback(async () => {
        fetchTargets().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: TARGETS, targets: response.data })
                dispatch({ type: SYNC_STATUS_TARGETS, targetsSynced: true })
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getTargets())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getTargets())
        })
    }, [dispatch, t])

    const filteredArtifacts = useMemo(() => {
        return props.artifacts.filter(a => a.name.toLowerCase().indexOf(search) !== -1);
    }, [props.artifacts, search]);

    useEffect(() => {
        if (!targetsSynced) {
            getTargets()
        }
    }, [getTargets, targetsSynced])

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
            artifactId: artifact,
            // TODO: Backend muss latest akzeptieren
            milestoneId: "latest"
        }));
        deployMultiple(deployments).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                helpers.makeSuccessToast(t("deployment.deployedMultiple", { deployedMilestones: response.data.length }))
                dispatch({ type: SYNC_STATUS_MILESTONE, dataSynced: false });
                props.onCancelled()
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => deploy())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => deploy())
        })
    }, [target, selectedArtifacts, dispatch, props, t])

    const onCancel = () => {
        setSelectedArtifacts([])
        props.onCancelled()
    }

    return (
        <PopupDialog
            open={props.open}
            title={t("deployment.multiple")}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("milestone.deployMultiple")}
            onFirst={deploy}
            secondTitle={t("dialog.close")}
            onSecond={onCancel}>
            <SettingsForm large>
                <SettingsSelect
                    disabled={false}
                    label={t("deployment.target")}
                    value={target}
                    onChanged={setTarget}>
                    {targets.map(target => (
                        <MenuItem key={target} value={target}>{target}</MenuItem>
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
                            className={clsx(classes.root, disabled && classes.disabled)}
                            control={(
                                <Checkbox
                                    disableFocusRipple
                                    disableRipple
                                    disableTouchRipple
                                    color="primary"
                                    className={classes.checkbox}
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
export default DeployMultipleDialog;
