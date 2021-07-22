import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import PopupDialog from "../../../components/Form/PopupDialog";
import {deployVersion} from "../../../store/actions/deploymentAction";
import SettingsSelect from "../../../components/Form/SettingsSelect";
import MenuItem from "@material-ui/core/MenuItem";
import {RootState} from "../../../store/reducers/rootReducer";


interface Props {
    artifactId: string;
    versionId: string;
    open: boolean;
    versionNumber: number;
    onCancelled: () => void
}

const DeployVersionDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    const targets: Array<string> = useSelector((state: RootState) => state.deployment.targets)

    const [error, setError] = useState<string | undefined>(undefined);
    const [target, setTarget] = useState<string>("");


    useEffect(() => {
        targets.sort();
    }, [targets])


    const applyChanges = useCallback(async () => {
        try {
            dispatch(deployVersion(target, props.artifactId, props.versionId));
            props.onCancelled();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    }, [target, props, dispatch]);

    return (
        <PopupDialog
            open={props.open}
            title={t("deployment.dialogHeader", {versionNumber: props.versionNumber})}
            error={error}
            onCloseError={() => setError(undefined)}
            firstTitle={t("dialog.applyChanges")}
            onFirst={applyChanges}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstDisabled={target === ""}>

            <SettingsSelect
                disabled={false}
                required={true}
                value={target}
                label={t("properties.target")}
                onChanged={setTarget}>
                {targets.map(singleTarget => (
                    <MenuItem
                        key={singleTarget}
                        value={singleTarget}>
                        {singleTarget}
                    </MenuItem>
                ))}

            </SettingsSelect>
        </PopupDialog>
    );
};

export default DeployVersionDialog;