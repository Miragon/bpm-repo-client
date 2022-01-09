import { AddBoxOutlined } from "@material-ui/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Popup from "../Common/Popup";
import MenuList, { MenuListConfig } from "../MenuList/MenuList";
import ActionButton from "./ActionButton";

interface Props {
    addOptions: MenuListConfig;
    onAdd: (value: string) => void;
    primary: boolean;
}

const AddButton: React.FC<Props> = props => {
    const { t } = useTranslation("common");

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();

    return (
        <>
            <ActionButton
                onClick={e => setMenuAnchor(e.currentTarget)}
                label={t("action.add")}
                icon={AddBoxOutlined}
                primary={props.primary}
                active={false} />
            <Popup
                arrowInset={10}
                background="#FFFFFF"
                anchor={menuAnchor}
                onClose={() => setMenuAnchor(undefined)}
                placement="bottom-end">
                {({ close }) => (
                    <MenuList
                        options={props.addOptions}
                        onClick={action => {
                            props.onAdd(action);
                            setTimeout(close);
                        }} />
                )}
            </Popup>
        </>
    );
};

export default AddButton;
