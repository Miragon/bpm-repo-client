import React, {useCallback} from "react";
import {SharedListItem} from "./SharedRepositories";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {AxiosResponse} from "axios";
import {ShareWithRepositoryTORoleEnum, ShareWithTeamTORoleEnum} from "../../../api";
import helpers from "../../../util/helperFunctions";
import {SYNC_STATUS_SHARED} from "../../../constants/Constants";
import DropdownButton, {DropdownButtonItem} from "../../Shared/Form/DropdownButton";

interface Props {
    option: SharedListItem;
    updateMethod: (artifactId: string, targetId: string, role: ShareWithRepositoryTORoleEnum | ShareWithTeamTORoleEnum) => Promise<AxiosResponse>;
}

const SelectShareWithRepositoryRoleDropDown: React.FC<Props> = props => {
    const { t } = useTranslation("common");
    const dispatch = useDispatch();


    //TODO: Types here: works for both requests (updat Team assignment AND update Repository assignemt) -> resolves to same value, even if the wrong type is specified here
    // => Define one global RoleEnum and don't always use the nested roleenums
    const updateRole = useCallback(async (newRole: ShareWithRepositoryTORoleEnum) => {

        props.updateMethod(props.option.artifactId, props.option.targetId, newRole).then(response => {
            if (Math.floor(response.status / 100) === 2) {
                helpers.makeSuccessToast(t("role.updated", {repoName: props.option.repoName, role: newRole}))
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

export default SelectShareWithRepositoryRoleDropDown;