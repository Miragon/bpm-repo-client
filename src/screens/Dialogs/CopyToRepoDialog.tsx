import MenuItem from "@material-ui/core/MenuItem";
import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {RepositoryTO} from "../../api";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import {RootState} from "../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";
import {copyToRepo} from "../../store/actions";

interface Props {
    open: boolean;
    onCancelled: () => void;
    name: string
    artifactId: string;
}

const CopyToRepoDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [repository, setRepository] = useState<string>("");

    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );

    const onCopy = useCallback(async () => {
        try {
            if(repository){
                dispatch(copyToRepo(repository, props.artifactId));
                setRepository("")
                props.onCancelled();
            }
        } catch (err) {
            console.log(err);
        }
    }, [dispatch, repository, props]);


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.copy", {artifactName: props.name})}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.copy")}
            onFirst={onCopy} >

            <SettingsForm large>

                <SettingsSelect
                    disabled={false}
                    value={repository}
                    label={t("repository.target")}
                    onChanged={setRepository}>
                    {allRepos?.map(repo => (
                        <MenuItem
                            key={repo.id}
                            value={repo.id}>
                            {repo.name}
                        </MenuItem>
                    ))}
                </SettingsSelect>

            </SettingsForm>
        </PopupDialog>
    );
};
export default CopyToRepoDialog;
