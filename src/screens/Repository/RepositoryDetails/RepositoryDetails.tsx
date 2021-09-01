import {IconButton} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Description, People, Settings} from "@material-ui/icons/";
import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RepositoryTO} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import UserManagementDialog from "./Dialogs/UserManagementDialog";
import EditRepoDialog from "./Dialogs/EditRepoDialog";
import PopupSettings from "../../../components/Form/PopupSettings";
import {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import {useTranslation} from "react-i18next";
import DeployMultipleDialog from "./Dialogs/DeployMultipleDialog";


const useStyles = makeStyles(() => ({
    container: {
        marginBottom: "1rem"
    },
    header: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between"
    },
    headerText: {
        color: "black",
        fontSize: "1.3rem",
    },
    repoInfo: {
        minWidth: "150px",
        maxWidth: "150px",
        display: "flex",
        justifyContent: "space-between",
        color: "black",
        fontSize: "0.8rem"
    },
    description: {
        color: "black",
        fontWeight: "lighter",
        fontStyle: "italic"
    }

}));
const RepositoryDetails: React.FC = (() => {
    const classes = useStyles();
    const ref = useRef<HTMLButtonElement>(null);
    const {t} = useTranslation("common");

    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);

    const [popupOpen, setPopupOpen]= useState<boolean>(false);
    const [userManagementOpen, setUserManagementOpen] = useState<boolean>(false);
    const [deployMultipleOpen, setDeployMultipleOpen] = useState<boolean>(false);
    const [repoManagementOpen, setRepoManagementOpen] = useState<boolean>(false);


    const options: DropdownButtonItem[] = [

        {
            id: "UserManagement",
            label: t("repository.editUsers"),
            type: "button",
            onClick: () => {
                setUserManagementOpen(true)
            }
        },
        {
            id: "RepoManagement",
            label: t("repository.edit"),
            type: "button",
            onClick: () => {
                setRepoManagementOpen(true)
            }
        },
        {
            id: "DeployVersions",
            label: t("deployment.multiple"),
            type: "button",
            onClick: () => {
                setDeployMultipleOpen(true)
            }
        }

    ]


    if (activeRepo) {
        return (
            <div className={classes.container}>
                <div className={classes.header}>
                    <div className={classes.headerText}>
                        {activeRepo.name}
                    </div>
                    <div className={classes.repoInfo}>
                        <IconButton size="medium">
                            <Description fontSize="small" />
                            {activeRepo.existingArtifacts}
                        </IconButton>
                        <IconButton
                            size="medium"
                            onClick={() => setUserManagementOpen(true)}>
                            <People fontSize="small" />
                            {activeRepo.assignedUsers}
                        </IconButton>
                        <IconButton
                            size="medium"
                            ref={ref}
                            onClick={() => setPopupOpen(true)}>
                            <Settings />
                        </IconButton>

                        <PopupSettings
                            open={popupOpen}
                            reference={ref.current}
                            onCancel={() => setPopupOpen(false)}
                            options={options}/>

                    </div>
                </div>
                <div className={classes.description}>
                    {activeRepo.description}
                </div>
                <UserManagementDialog
                    open={userManagementOpen}
                    onCancelled={() => setUserManagementOpen(false)}
                    repoId={activeRepo.id} />

                <EditRepoDialog
                    open={repoManagementOpen}
                    onCancelled={() => setRepoManagementOpen(false)}
                    repoId={activeRepo.id}
                    repoName={activeRepo.name}
                    repoDescription={activeRepo.description} />

                <DeployMultipleDialog
                    open={deployMultipleOpen}
                    onCancelled={() => setDeployMultipleOpen(false)}
                    repoId={activeRepo.id} />
            </div>
        );
    }
    return (
        <div />
    );
});
export default RepositoryDetails;
