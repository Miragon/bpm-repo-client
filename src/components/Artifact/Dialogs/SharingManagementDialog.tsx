import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import AddSharingSearchBar from "./AddSharingSearchBar";
import SharedRepositories from "./SharedRepositories";
import {ArtifactTO, ShareWithRepositoryTORoleEnum} from "../../../api";
import {getManageableRepos, searchRepos} from "../../../store/actions";
import helpers from "../../../util/helperFunctions";
import PopupDialog from "../../Shared/Form/PopupDialog";
import {getSharedRepos, shareWithRepo, unshareWithRepo, updateShareWithRepo} from "../../../store/actions/shareAction";



interface Props {
    open: boolean;
    onCancelled: () => void;
    artifact: ArtifactTO | undefined;
}

const SharingManagementDialog: React.FC<Props> = props => {
    const { t } = useTranslation("common");

    const [error, setError] = useState<string | undefined>(undefined);
    //const [openedTab, setOpenedTab] = useState<string>("0");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //const [manageableRepos, setManageableRepos] = useState<RepositoryTO[]>([]);



    //TODO: Sollten Dateien auch mit Repositories geteilt werden können, die dem nutzer nicht
    // direkt zugewiesen sind?
    // GetManageable verwenden, um die möglichen Aktionen des users auf eigene Repos zu beschränken


    const getManageable = useCallback(async () => {
        getManageableRepos().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                //setManageableRepos(response.data)
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getManageable())
            }
        }, error => {
            helpers.makeErrorToast(t(typeof error.response.data === "string" ? error.response.data : error.response.data.error), () => getManageable())
        })
    }, [t])




    return (
        <PopupDialog
            error={error}
            onCloseError={() => setError(undefined)}
            open={props.open}
            title={t("artifact.share", { artifactName: props.artifact?.name })}
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



//TODO Add this tab when Teams return

/*

const useStyles = makeStyles((theme: Theme) => ({

    tab: {
        flexGrow: 1,
    }

}));

    const handleChangeTab = (event: React.ChangeEvent, newValue: string) => {
        //setOpenedTab(newValue)
        dispatch({ type: SYNC_STATUS_SHARED, sharedSynced: false })

    }



                    <TabContext value={openedTab} >

                        <TabList onChange={event => handleChangeTab} >
                            <Tab label={t("repository.repositories")} value="0"  className={classes.tab}/>
                            <Tab label={t("team.teams")} value="1" className={classes.tab}/>
                        </TabList>

                        <TabPanel value="0">
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
                        </TabPanel>



                    </TabContext>
                        


                        <TabPanel value="1">
                            <AddSharingSearchBar
                                entity="team"
                                repositoryId={props.artifact.repositoryId}
                                artifactId={props.artifact.id}
                                roleForNewAssignments={ShareWithTeamTORoleEnum.Viewer}
                                searchMethod={searchTeam}
                                shareMethod={shareWithTeam}/>
                            <SharedRepositories
                                entity={"team"}
                                artifact={props.artifact}
                                getSharedMethod={getSharedTeams}
                                unshareMethod={unshareWithTeam}
                                updateMethod={updateShareWithTeam}/>
                        </TabPanel>
 */