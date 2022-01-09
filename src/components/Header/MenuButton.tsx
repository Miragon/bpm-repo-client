import { MoreVertOutlined } from "@material-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Popup from "../Common/Popup";
import MenuList, { MenuListConfig } from "../MenuList/MenuList";
import ActionButton from "./ActionButton";

interface Props {
    menuOptions: MenuListConfig;
    onMenu: (value: string) => void;
}

const MenuButton: React.FC<Props> = props => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();

    const { t } = useTranslation("common");

    return (
        <>
            <ActionButton
                onClick={e => setMenuAnchor(e.currentTarget)}
                label={t("action.menu")}
                icon={MoreVertOutlined}
                primary={false}
                active={false} />
            <Popup
                arrowInset={10}
                background="#FFFFFF"
                anchor={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}
                placement="bottom-end">
                {({ close }) => (
                    <MenuList
                        options={props.menuOptions}
                        onClick={action => {
                            props.onMenu(action);
                            setTimeout(close);
                        }} />
                )}
            </Popup>
        </>
    );
};

export default MenuButton;
