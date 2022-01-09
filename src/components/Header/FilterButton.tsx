import { FilterListOutlined } from "@material-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Popup from "../Common/Popup";
import MenuListTitle from "../MenuList/MenuListTitle";
import SelectMenuList, { SelectMenuListConfig } from "../MenuList/SelectMenuList";
import ActionButton from "./ActionButton";

interface Props {
    active: string[];
    filterOptions: SelectMenuListConfig;
    onChange: (value: string, active: boolean) => void;
}

const FilterButton: React.FC<Props> = props => {
    const { t } = useTranslation("common");

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();

    return (
        <>
            <ActionButton
                onClick={e => setMenuAnchor(e.currentTarget)}
                label={t("action.filter")}
                icon={FilterListOutlined}
                primary={false}
                active={!!menuAnchor || props.active.length < props.filterOptions.flatMap(group => group).length} />
            <Popup
                arrowInset={10}
                background="#FFFFFF"
                anchor={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}
                placement="bottom-end">
                {() => (
                    <SelectMenuList
                        title={<MenuListTitle title={t("action.filterBy")} />}
                        active={props.active}
                        options={props.filterOptions}
                        onChange={props.onChange} />
                )}
            </Popup>
        </>
    );
};

export default FilterButton;
