import {Settings} from "@material-ui/icons/";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RepositoryTO} from "../../../api";
import {DropdownButtonItem} from "../../../components/Form/DropdownButton";
import PopupSettings from "../../../components/Form/PopupSettings";
import Section from "../../../components/Layout/Section";
import {RootState} from "../../../store/reducers/rootReducer";
import EditRepoDialog from "./Dialogs/EditRepoDialog";
import UserManagementDialog from "./Dialogs/UserManagementDialog";
import {makeStyles} from "@material-ui/styles";
import theme from "../../../theme";

const useStyles = makeStyles(() => ({
    description: {
        fontStyle: "italic",
        color: theme.palette.text.secondary,
        fontSize: "1rem",
        paddingBottom: "1rem"
    }
}))


const RepositoryDetails: React.FC = (() => {
    const { t } = useTranslation("common");
    const classes = useStyles();

    const activeRepo: RepositoryTO = useSelector((state: RootState) => state.repos.activeRepo);

    const [overflowTarget, setOverflowTarget] = useState<Element>();
    const [userManagementOpen, setUserManagementOpen] = useState(false);
    const [repoManagementOpen, setRepoManagementOpen] = useState(false);

    const options: DropdownButtonItem[] = [
        {
            id: "UserManagement",
            label: t("repository.editUsers"),
            type: "button",
            onClick: () => setUserManagementOpen(true)
        },
        {
            id: "RepoManagement",
            label: t("repository.edit"),
            type: "button",
            onClick: () => setRepoManagementOpen(true)
        }
    ]

    if (!activeRepo) {
        return null;
    }

    return (
        <Section
            title={activeRepo.name}
            actions={[{
                onClick: event => setOverflowTarget(event.currentTarget),
                icon: <Settings />
            }]}>
            <div className={classes.description}>
                {activeRepo.description}
            </div>

            <PopupSettings
                open={!!overflowTarget}
                reference={overflowTarget || null}
                onCancel={() => setOverflowTarget(undefined)}
                options={options} />

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

        </Section>
    );
});
export default RepositoryDetails;
