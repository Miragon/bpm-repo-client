import { SortOutlined } from "@material-ui/icons";
import React, { useState } from "react";
import Popup from "../Common/Popup";
import MenuListTitle from "../MenuList/MenuListTitle";
import SelectMenuList, { SelectMenuListConfig } from "../MenuList/SelectMenuList";
import ActionButton from "./ActionButton";

interface Props {
    active: string;
    sortOptions: SelectMenuListConfig;
    onChange: (value: string) => void;
}

const SortButton: React.FC<Props> = props => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();

    return (
        <>
            <ActionButton
                onClick={e => setMenuAnchor(e.currentTarget)}
                label="Sortieren"
                icon={SortOutlined}
                primary={false}
                active={!!menuAnchor} />
            <Popup
                arrowInset={10}
                background="#FFFFFF"
                anchor={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}
                placement="bottom-end">
                {({ close }) => (
                    <SelectMenuList
                        title={<MenuListTitle title="Sortieren nach" />}
                        active={[props.active]}
                        options={props.sortOptions}
                        onChange={value => {
                            props.onChange(value);
                            setTimeout(close);
                        }} />
                )}
            </Popup>
        </>
    );
};

export default SortButton;
