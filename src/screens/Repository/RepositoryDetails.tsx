import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {BpmnDiagramTO, BpmnRepositoryRequestTO} from "../../api/models";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {People, Description}  from '@material-ui/icons/';
import UserManagementDialog from "./UserManagementDialog";


const useStyles = makeStyles(() => ({
header: {
    display: "flex",
    width: "100%"
},
headerText: {
    color: "black",
    fontSize: "20px"
},
repoInfo: {
    position: "absolute",
    right: "20px",
    display: "flex",
    color: "black",
    fontSize: "15px"
},
description: {
    color: "black",
    fontSize: "14px",
    fontWeight: "lighter",
    fontStyle: "italic"
},
icon: {
    width: "70px",
    margin: "0 0.25rem 0 0.5rem"
}

}));
const RepositoryDetails: React.FC = (() => {
    const classes = useStyles();

    const activeRepo: BpmnRepositoryRequestTO = useSelector((state: RootState) => state.activeRepo.activeRepo)

    const [userManagementOpen, setUserManagementOpen] = useState<boolean>(false);



    if(activeRepo){
        return (
            <>
                <div className={classes.header}>
                    <div className={classes.headerText} >
                        {activeRepo.bpmnRepositoryName}
                    </div>
                    <div className={classes.repoInfo} >
                        <Description className={classes.icon}/>
                        {activeRepo.existingDiagrams}
                        <People className={classes.icon} onClick={() => setUserManagementOpen(true)}/>
                        {activeRepo.assignedUsers}
                    </div>
                </div>
                <div className={classes.description}>
                    {activeRepo.bpmnRepositoryDescription}
                </div>
                <UserManagementDialog
                    open={userManagementOpen}
                    onCancelled={() => setUserManagementOpen(false)}
                />
            </>
        );
    }
    else {
        return (
            <div></div>
        );
    }

});
export default RepositoryDetails;