import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ActionButtonPopup from "../Header/ActionButtonPopup";
import MenuList, { MenuListConfig } from "../MenuList/MenuList";
import FileListEntry, { FileDescription } from "./FileListEntry";

interface Props {
    files: FileDescription[];
    fallback: string;
    onFavorite: (file: FileDescription, value: boolean) => void;
    onClick: (file: FileDescription) => void;
    onMenuClick: (operation: string, file: FileDescription) => void;
    menuEntries: MenuListConfig;
}

const useStyles = makeStyles({
    root: {

    },
    fallback: {

    }
});

const FileList: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const { t } = useTranslation("common");

    const {
        fallback,
        files,
        menuEntries,
        onMenuClick,
        onFavorite,
        onClick
    } = props;

    const [menuAnchor, setMenuAnchor] = useState<{
        target: HTMLButtonElement;
        file: FileDescription;
    }>();

    return (
        <div className={classes.root}>
            {files.length === 0 && (
                <Typography
                    variant="body1"
                    className={classes.fallback}>
                    {t(props.fallback)}
                </Typography>
            )}
            {files.map(file => (
                <FileListEntry
                    key={file.id}
                    file={file}
                    onClick={() => props.onClick(file)}
                    onFavorite={value => props.onFavorite(file, value)}
                    onMenuClicked={target => setMenuAnchor({ target, file })} />
            ))}
            <ActionButtonPopup
                anchor={menuAnchor?.target}
                onClose={() => setMenuAnchor(undefined)}>
                {({ close }) => (
                    <MenuList
                        onClick={action => {
                            if (menuAnchor) {
                                props.onMenuClick(action, menuAnchor.file);
                                setTimeout(() => setMenuAnchor(undefined));
                            }
                        }}
                        options={props.menuEntries} />
                )}
            </ActionButtonPopup>
        </div>
    );
};

export default FileList;
