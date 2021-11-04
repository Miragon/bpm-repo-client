import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import AddSharingSearchBar from "./AddSharingSearchBar";
import SharedRepositories from "./SharedRepositories";
import {ArtifactTO, ShareWithRepositoryTORoleEnum} from "../../../api";
import {getManageableRepos, searchRepos} from "../../../store/actions";
import PopupDialog from "../../Shared/Form/PopupDialog";
import {getSharedRepos, shareWithRepo, unshareWithRepo, updateShareWithRepo} from "../../../store/actions/shareAction";
import {makeErrorToast} from "../../../util/toastUtils";

interface Props {
    open: boolean;
    onCancelled: () => void;
    artifact: ArtifactTO | undefined;
}

const SharingManagementDialog: React.FC<Props> = props => {
    const {t} = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);


    const getManageable = useCallback(async () => {
        getManageableRepos().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                //setManageableRepos(response.data)
            } else {
                makeErrorToast(t(response.data.toString()), () => getManageable())
            }
        }, error => {
            makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => getManageable())
        })
    }, [t])


    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.share", {artifactName: props.artifact?.name})}
            firstTitle={t("dialog.close")}
            onFirst={() => props.onCancelled()}>


            {props.artifact && (
                <>

                    <AddSharingSearchBar
                        entity="repository"
                        repositoryId={props.artifact.repositoryId}
                        artifactId={props.artifact.id}
                        roleForNewAssignments={ShareWithRepositoryTORoleEnum.Viewer}
                        searchMethod={searchRepos}
                        shareMethod={shareWithRepo}/>
                    <SharedRepositories
                        entity={"repository"}
                        artifact={props.artifact}
                        getSharedMethod={getSharedRepos}
                        unshareMethod={unshareWithRepo}
                        updateMethod={updateShareWithRepo}/>


                </>
            )}

        </PopupDialog>
    );
};
export default SharingManagementDialog;