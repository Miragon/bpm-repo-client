import React, {useEffect} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {KeyboardArrowUp} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import {ArtifactVersionTO} from "../../../api/models";
import {useDispatch} from "react-redux";
import {GET_VERSIONS} from "../../../store/constants";
import {useTranslation} from "react-i18next";
import VersionItem from "./VersionItem";

const useStyles = makeStyles(() => ({
    versionsButtonClose: {
        bottom: "0px",
        width: "100%",
        alignItems: "center",
        transition: "background-color .3s",
        textAlign: "center",
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: "lightgrey"
        },
    },


}));

interface Props {
    artifactId: string;
    repoId: string;
    loading: boolean;
    fileType: string;
    artifactTitle: string;
    artifactVersionTOs: ArtifactVersionTO[];
}

const VersionDetails: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {t} = useTranslation("common");

    useEffect(() => {
        if (props.artifactVersionTOs) {
            props.artifactVersionTOs.sort(compare);
        }
    }, [props.artifactVersionTOs]);

    const compare = (a: ArtifactVersionTO, b: ArtifactVersionTO) => {
        if (a.milestone < b.milestone) {
            return -1;
        }
        if (a.milestone > b.milestone) {
            return 1;
        }
        return 0;
    };


    const closeVersions = (event: React.MouseEvent<HTMLElement>): void => {
        event.stopPropagation();
        dispatch({type: GET_VERSIONS, versions: []});
    };


    return (
        <>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <b>{t("version.version")}</b>
                        </TableCell>
                        <TableCell>
                            <b>{t("properties.comment")}</b>
                        </TableCell>
                        <TableCell>
                            <b>{t("properties.date")}</b>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.loading
                    && (
                        <TableRow key="loading" hover>
                            <TableCell colSpan={3} align="center">
                                <>
                                    {props.loading ? <CircularProgress color="inherit" size={20}/> : null}
                                </>
                            </TableCell>
                        </TableRow>
                    )}
                    {props.artifactVersionTOs?.map(singleVersion => (
                        <VersionItem
                            key={singleVersion.id}
                            artifactVersion={singleVersion}
                            repoId={props.repoId}
                            fileType={props.fileType}
                            artifactTitle={props.artifactTitle} />
                    ))}
                </TableBody>
            </Table>

            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div className={classes.versionsButtonClose} onClick={(event => closeVersions(event))}>
                <KeyboardArrowUp/>
            </div>


        </>
    );
});
export default VersionDetails