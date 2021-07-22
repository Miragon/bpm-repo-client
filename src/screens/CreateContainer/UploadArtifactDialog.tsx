import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {ArtifactVersionUploadTOSaveTypeEnum, RepositoryTO} from "../../api/models";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import * as artifactAction from "../../store/actions/artifactAction";
import * as versionAction from "../../store/actions/versionAction";
import {UNHANDLEDERROR} from "../../store/constants";
import {RootState} from "../../store/reducers/rootReducer";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    input: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        marginBottom: "12px"
    }
}));

interface Props {
    open: boolean;
    onCancelled: () => void;
    repo?: RepositoryTO;
}

const UploadArtifactDialog: React.FC<Props> = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");


    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState<string>(props.repo ? props.repo.id : "");
    const [file, setFile] = useState<string>("");

    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );
    const uploadedArtifact = useSelector(
        (state: RootState) => state.artifacts.uploadedArtifact
    );

    useEffect(() => {
        if (uploadedArtifact) {
            dispatch(versionAction.createOrUpdateVersion(
                uploadedArtifact.id, file, ArtifactVersionUploadTOSaveTypeEnum.MILESTONE
            ));
        }
    }, [dispatch, uploadedArtifact, file]);

    useEffect(() => {
        setRepository(props.repo?.id);
    }, [props.repo]);

    const onCreate = useCallback(async () => {
        try {
            //#TODO: write some code to get the file extension from the filename and pass it here
            dispatch(artifactAction.uploadArtifact(repository, title, description, "BPMN"));
            props.onCancelled();
        } catch (err) {
            dispatch({ type: UNHANDLEDERROR, errorMessage: err });
        }
    }, [title, description, repository, props, dispatch]);

    const onFileChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { target: { files } } = e;
        if (files != null && files.length > 0) {
            const f = files[0];
            const fileExtension = f.name.substring(f.name.lastIndexOf("."), f.name.length);
            if (fileExtension !== ".bpmn") {
                dispatch({ type: UNHANDLEDERROR, errorMessage: "File must be of type .bpmn" });
            }
            const reader = new FileReader();
            reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
                if (typeof event.target?.result === "string") {
                    setFile(event.target?.result);
                }
            });
            reader.readAsText(f);
        }
    }, [dispatch]);

    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.upload")}
            secondTitle={t("dialog.cancel")}
            onSecond={props.onCancelled}
            firstTitle={t("dialog.create")}
            onFirst={onCreate}>

            <SettingsForm large>

                <input
                    className={classes.input}
                    accept=".bpmn,.dmn"
                    type="file"
                    name="file"
                    onChange={onFileChanged} />

                <SettingsSelect
                    disabled={false}
                    value={props.repo ? props.repo.id : repository}
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
                    onChanged={setTitle} />

                <SettingsTextField
                    label={t("properties.description")}
                    value={description}
                    multiline
                    rows={3}
                    rowsMax={3}
                    onChanged={setDescription} />

            </SettingsForm>
        </PopupDialog>
    );
};

export default UploadArtifactDialog;
