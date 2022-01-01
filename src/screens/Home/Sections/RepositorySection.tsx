import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ScreenSectionHeader from "../../../components/Layout/Header/ScreenSectionHeader";
import Pagination from "../../../components/Layout/List/Pagination";
import RepositoryCard from "../../../components/Layout/Repositories/RepositoryCard";
import { RootState } from "../../../store/reducers/rootReducer";
import { loadRepositories } from "../../../store/RepositoryState";
import { usePagination } from "../../../util/hooks/usePagination";
import { getRepositoryUrl } from "../../../util/Redirections";
import { searchAllCaseInsensitive } from "../../../util/SearchUtils";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "1rem"
    },
    content: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: "0 -0.5rem 1rem -0.5rem"
    },
    fallback: {
        margin: "0.5rem",
        fontSize: "0.9rem",
        fontWeight: 300
    }
}));

interface Props {
    search: string;
    loadKey: number;
    onChange: () => void;
}

const RepositorySection: React.FC<Props> = props => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();

    const { t } = useTranslation("common");

    const repositories = useSelector((state: RootState) => state.repositories);
    const filtered = useMemo(() => {
        return (repositories.value || []).filter(repo => (
            searchAllCaseInsensitive(props.search, repo.name, repo.description)
        ));
    }, [props.search, repositories]);

    const { pageItems, paginationConfig } = usePagination(filtered, 6);

    useEffect(() => {
        dispatch(loadRepositories());
    }, [dispatch]);

    // Reload if something changed in the other sections
    useEffect(() => {
        if (props.loadKey > 0) {
            dispatch(loadRepositories(true));
        }
    }, [dispatch, props.loadKey]);

    if (props.search && filtered.length === 0) {
        return null;
    }

    return (
        <>
            <ScreenSectionHeader title={props.search ? "Repositories" : "Alle Repositories"} />
            <div className={classes.root}>
                <div className={classes.content}>
                    {pageItems.map(repo => (
                        <RepositoryCard
                            key={repo.id}
                            repository={repo}
                            onClick={() => history.push(getRepositoryUrl(repo))} />
                    ))}
                    {filtered.length === 0 && (
                        <Typography
                            variant="body1"
                            className={classes.fallback}>
                            {t("repository.notAvailable")}
                        </Typography>
                    )}
                </div>
                <Pagination config={paginationConfig} />
            </div>
        </>
    );
};

export default RepositorySection;
