import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import PopupDialog from "../Form/PopupDialog";
import {SYNC_STATUS_RECENT, SYNC_STATUS_REPOSITORY} from "../../../constants/Constants";
import SettingsForm from "../Form/SettingsForm";
import SettingsSelect from "../Form/SettingsSelect";
import {ArtifactTypeTO, RepositoryTO} from "../../../api";
import {useTranslation} from "react-i18next";
import {RootState} from "../../../store/reducers/rootReducer";
import {createArtifact} from "../../../store/actions";
import helpers from "../../../util/helperFunctions";
import SettingsTextField from "../Form/SettingsTextField";
import {createMilestone} from "../../../store/actions/milestoneAction";


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
    const [uploadedFileType, setUploadedFileType] = useState<string>("");
    const [description, setDescription] = useState("");
    const [repoId, setRepoId] = useState<string>(props.repo ? props.repo.id : "");
    const [file, setFile] = useState<string>("");


    const fileTypeList = Array<string>();
    const allRepos: Array<RepositoryTO> = useSelector(
        (state: RootState) => state.repos.repos
    );
    const fileTypes: Array<ArtifactTypeTO> = useSelector((state: RootState) => state.artifacts.fileTypes)

    useEffect(() => {
        fileTypes.map(type => fileTypeList.push(type.fileExtension))
    })


    const onCreate = useCallback(async () => {
        //1. Create a new Artifact
        //2. Use the returned artifactId to create a new milestone, which includes the uploaded file
        createArtifact(repoId, title, description, uploadedFileType)
            .then(response => {
                if(Math.floor(response.status / 100) === 2){
                    createMilestone(response.data.id, file)
                        .then(response2 => {
                            if(Math.floor(response2.status / 100) === 2){
                                dispatch({type: SYNC_STATUS_REPOSITORY, dataSynced: false})
                                dispatch({type: SYNC_STATUS_RECENT, dataSynced: false})
                                helpers.makeSuccessToast(t("artifact.created"))
                                props.onCancelled()
                            } else{
                                helpers.makeErrorToast(t(response2.data.toString()), () => createMilestone(response.data.id, file))
                            }
                        }, error => {
                            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => createMilestone(response.data.id, file))
                        })
                } else {
                    helpers.makeErrorToast(t(response.data.toString()), () => onCreate())
                }
            }, error => {
                helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => onCreate())
            })
    }, [repoId, title, description, uploadedFileType, file, dispatch, t, props]);

    const onFileChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { target: { files } } = e;
        if (files != null && files.length > 0) {
            const f = files[0];
            const fileExtension = f.name.substring(f.name.lastIndexOf(".") + 1, f.name.length);
            if (!fileTypeList.includes(fileExtension)) {
                helpers.makeErrorToast("exception.fileTypeNotSupported", () => onFileChanged)
            }
            setUploadedFileType(fileExtension);
            const reader = new FileReader();
            reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
                if (typeof event.target?.result === "string") {
                    setFile(event.target?.result);
                }
            });
            reader.readAsText(f);
        }
    }, [fileTypeList]);

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
                    accept={"."+fileTypeList.join(",.")}
                    type="file"
                    name="file"
                    onChange={onFileChanged} />

                <SettingsSelect
                    disabled={false}
                    value={repoId}
                    label={t("repository.target")}
                    onChanged={setRepoId}>
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
                    minRows={3}
                    maxRows={3}
                    onChanged={setDescription} />

            </SettingsForm>
        </PopupDialog>
    );
};

export default UploadArtifactDialog;
