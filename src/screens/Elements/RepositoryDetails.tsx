import React, {useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {BpmnDiagramTO, BpmnRepositoryRequestTO} from "../../api/models";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import {People, Description}  from '@material-ui/icons/';


const useStyles = makeStyles(() => ({
header: {
    display: "flex"
},
headerText: {
    color: "black",
    fontSize: "20px"
},
repoInfo: {
    marginLeft: "100px",
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


    return (
        <>
            <div className={classes.header}>
                <div className={classes.headerText} >
                    {activeRepo.bpmnRepositoryName}
                </div>
                <div className={classes.repoInfo} >
                    <Description className={classes.icon}/>
                    {activeRepo.existingDiagrams}
                    <People className={classes.icon}/>
                    {activeRepo.assignedUsers}
                </div>
            </div>
            <div className={classes.description}>
                {activeRepo.bpmnRepositoryDescription}
            </div>
        </>
    );
});
export default RepositoryDetails;