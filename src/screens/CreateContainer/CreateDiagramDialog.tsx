import React, {useCallback, useState} from "react";
import PopupDialog from "../../components/Form/PopupDialog";
import SettingsForm from "../../components/Form/SettingsForm";
import SettingsSelect from "../../components/Form/SettingsSelect";
import SettingsTextField from "../../components/Form/SettingsTextField";
import {BpmnRepositoryRequestTO} from "../../api/models";
import {useDispatch, useSelector} from "react-redux";
import * as diagramAction from "../../store/actions/diagramAction";
import MenuItem from "@material-ui/core/MenuItem";
import {RootState} from "../../store/reducers/rootReducer";
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    open: boolean;
    onCancelled: () => void;
    type: "bpmn" | "dmn";
}

const CreateDiagramDialog: React.FC<Props> = props => {

    const {
        open, onCancelled, type
    } = props;
    const dispatch = useDispatch();
    const [error, setError] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [repository, setRepository] = useState("");

    const allRepos: Array<BpmnRepositoryRequestTO> = useSelector((state: RootState) => state.repos.repos)


    const onCreate = useCallback(async () => {
        try{
            dispatch(diagramAction.createDiagram(repository, title, description, props.type))
            onCancelled();
        } catch (err) {
            console.log("err")
        }
    }, [dispatch, repository, title, description, props.type])




    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={open}
            title={`Create ${type === "bpmn" ? "BPMN" : "DMN"} Diagram`}
            secondTitle="Cancel"
            onSecond={onCancelled}
            firstTitle="Create"
            onFirst={onCreate}>

            <SettingsForm large>

                <SettingsSelect
                    disabled={false}
                    value={repository}
                    label="Target Repository"
                    onChanged={setRepository}>
                    {allRepos?.map(repo => (
                        <MenuItem
                        key={repo.bpmnRepositoryId}
                        value={repo.bpmnRepositoryId}>
                            {repo.bpmnRepositoryName}
                        </MenuItem>
                    ))}
                </SettingsSelect>

                <SettingsTextField
                    label="Title"
                    value={title}
                    onChanged={setTitle} />

                <SettingsTextField
                    label="Description"
                    value={description}
                    multiline
                    rows={3}
                    rowsMax={3}
                    onChanged={setDescription} />

            </SettingsForm>
        </PopupDialog>
    );
};
/* inside the settingsSelect paragraph
                    {repositories.map(repo => (
                        <MenuItem key={repo.repoId} value={repo.repoId}>
                            {repo.repoName}
                        </MenuItem>
                    ))}
 */
export default CreateDiagramDialog;
