import React, {useCallback} from "react";
import {SharedListItem} from "./SharedRepositories";
import DropdownButton, {DropdownButtonItem} from "../../../../components/Form/DropdownButton";
import {useTranslation} from "react-i18next";
import {updateShareWithRepo} from "../../../../store/actions/shareAction";
import {SYNC_STATUS_SHARED} from "../../../../constants/Constants";
import helpers from "../../../../util/helperFunctions";
import {useDispatch} from "react-redux";
import {ShareWithRepositoryTORoleEnum} from "../../../../api";

interface Props {
    option: SharedListItem;
}

const SharedRepositories: React.FC<Props> = props => {
    const { t } = useTranslation("common");
    const dispatch = useDispatch();

    const updateRole = useCallback(async (newRole: ShareWithRepositoryTORoleEnum) => {

        updateShareWithRepo(props.option.artifactId, props.option.repoId, newRole).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                helpers.makeSuccessToast(t("share.updatedRepoRole", {repoName: props.option.repoName, role: newRole}))
                dispatch({ type: SYNC_STATUS_SHARED, sharedSynced: false });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => updateRole(newRole))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => updateRole(newRole))
        })
    }, [dispatch, props, t])

    const roles: DropdownButtonItem[] = [

        {
            id: "Admin",
            label: ShareWithRepositoryTORoleEnum.Admin,
            type: "button",
            onClick: () => {
                updateRole(ShareWithRepositoryTORoleEnum.Admin)
            }
        },
        {
            id: "Member",
            label: ShareWithRepositoryTORoleEnum.Member,
            type: "button",
            onClick: () => {
                updateRole(ShareWithRepositoryTORoleEnum.Member)
            }
        },
        {
            id: "Viewer",
            label: ShareWithRepositoryTORoleEnum.Viewer,
            type: "button",
            onClick: () => {
                updateRole(ShareWithRepositoryTORoleEnum.Viewer)
            }
        },
    ];

    return (
        <>
            <DropdownButton options={roles} title={props.option.role} type={"default"} />
        </>
    );
}

export default SharedRepositories;