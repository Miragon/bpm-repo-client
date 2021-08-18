import MenuItem from "@material-ui/core/MenuItem";
import React, {useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {ArtifactTypeTO, RepositoryTO} from "../../api";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {RootState} from "../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";
import {createArtifactWithDefaultVersion} from "../../store/actions";

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: string;
    repo?: RepositoryTO;
}

const CreateArtifactDialog: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [repository, setRepository] = useState<string>(props.repo ? props.repo.id : "");

    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes)
    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );

    const onCreate = useCallback(async () => {
        setRepository(props.repo ? props.repo.id : "")
        try {
            const defaultFileProps = fileTypes.find(fileType => fileType.name === props.type)
            if(defaultFileProps){
                dispatch(createArtifactWithDefaultVersion(props.repo?.id ? props.repo.id : repository, title, description, "" , defaultFileProps.name, ""));
                setTitle("")
                setDescription("")
                setRepository("")
                props.onCancelled();
            }

        } catch (err) {
            console.log(err);
        }
    }, [dispatch, repository, title, description, props, fileTypes]);


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t(`artifact.create${props.type}`)}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={onCreate} >

            <SettingsForm large>

                <SettingsSelect
                    disabled={false}
                    value={repository}
                    label={t("repository.target")}
                    onChanged={setRepository}>
                    {props.repo
                        ? (
                            <MenuItem
                                key={props.repo?.id}
                                value={props.repo?.id}>
                                {props.repo?.name}
                            </MenuItem>
                        )
                        : allRepos?.map(repo => (
                            <MenuItem
                                key={repo.id}
                                value={repo.id}>
                                {repo.name}
                            </MenuItem>
                        ))}
                </SettingsSelect>

                <SettingsTextField
                    label={t("properties.title")}
                    value={title}
                    onChanged={setTitle}/>

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    rows={3}
                    rowsMax={3}
                    onChanged={setDescription}/>

            </SettingsForm>
        </PopupDialog>
    );
};
export default CreateArtifactDialog;
