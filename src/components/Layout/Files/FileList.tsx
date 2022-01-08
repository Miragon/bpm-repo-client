import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MenuList, { MenuListConfig } from "../MenuList/MenuList";
import FileListEntry, { FileDescription } from "./FileListEntry";
import FileListPopup from "./FileListPopup";

interface Props {
    files: FileDescription[];
    fallback: string;
    className?: string;
    onFavorite: (file: FileDescription, value: boolean) => void;
    onClick: (file: FileDescription) => void;
    onMenuClick: (operation: string, file: FileDescription) => void;
    menuEntries: MenuListConfig;
}

const useStyles = makeStyles({
    root: {},
    fallback: {}
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
        onClick,
        className
    } = props;

    // Make sure this component is re-rendered every 60 seconds to update the view and the times
    const [, setRenderKey] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setRenderKey(cur => cur + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    const [menuAnchor, setMenuAnchor] = useState<{
        target: HTMLButtonElement;
        file: FileDescription;
    }>();

    return (
        <div className={clsx(classes.root, className)}>
            {files.length === 0 && (
                <Typography
                    variant="body1"
                    className={classes.fallback}>
                    {t(fallback)}
                </Typography>
            )}
            {files.map(file => (
                <FileListEntry
                    key={file.id}
                    file={file}
                    onClick={() => onClick(file)}
                    onFavorite={value => onFavorite(file, value)}
                    onMenuClicked={target => setMenuAnchor({ target, file })} />
            ))}
            <FileListPopup
                anchor={menuAnchor?.target}
                onClose={() => setMenuAnchor(undefined)}>
                {({ close }) => (
                    <MenuList
                        onClick={action => {
                            if (menuAnchor) {
                                onMenuClick(action, menuAnchor.file);
                                setTimeout(close);
                            }
                        }}
                        options={menuEntries} />
                )}
            </FileListPopup>
        </div>
    );
};

export default FileList;
