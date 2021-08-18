import {IconButton} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Description, People, Settings} from "@material-ui/icons/";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {RepositoryTO} from "../../../api";
import {RootState} from "../../../store/reducers/rootReducer";
import UserManagementDialog from "./Dialogs/UserManagementDialog";
import EditRepoDialog from "./Dialogs/EditRepoDialog";


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

    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);

    const [userManagementOpen, setUserManagementOpen] = useState<boolean>(false);
    const [repoManagementOpen, setRepoManagementOpen] = useState<boolean>(false);


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
                            onClick={() => setRepoManagementOpen(true)}>
                            <Settings />
                        </IconButton>

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
            </div>
        );
    }
    return (
        <div />
    );
});
export default RepositoryDetails;
