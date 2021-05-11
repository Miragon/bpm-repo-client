import { makeStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useStore } from "../../providers/RootStoreProvider";
import RepoCard from "./Holder/RepoCard";

const useStyles = makeStyles(() => ({
    header: {
        display: "flex"
    },
    headerText: {
        color: "black",
        fontSize: "20px"
    },
    container: {
        overflowX: "auto",
        display: "flex",
        flexWrap: "wrap",
        padding: "1rem 0"
    }
}));

const RepoContainer: React.FC = observer(() => {
    const classes = useStyles();
    const store = useStore();

    useEffect(() => {
        store.repoStore.initialize();
    }, [store.repoStore])

    return (
        <>
            <div className={classes.header}>
                <div className={classes.headerText}>
                    Repositories
                </div>
            </div>

            <div className={classes.container}>
                {store.repoStore.getAllRepos().map(repo => (
                    // eslint-disable-next-line react/jsx-key
                    <RepoCard
                        repoTitle={repo.bpmnRepositoryName}
                        description={repo.bpmnRepositoryDescription}
                        existingDiagrams={repo.existingDiagrams}
                        assignedUsers={repo.assignedUsers} />
                ))}

            </div>
        </>
    );
});

export default RepoContainer;

