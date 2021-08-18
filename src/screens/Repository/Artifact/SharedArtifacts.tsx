import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllSharedArtifacts, getSharedArtifacts} from "../../../store/actions";
import {RootState} from "../../../store/reducers/rootReducer";
import helpers from "../../../constants/Functions";
import {ArtifactTO} from "../../../api";
import {useParams} from "react-router";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import ArtifactListItem from "./Holder/ArtifactListItem";


const useStyles = makeStyles(() => ({
    headerText: {
        fontSize: "1.3rem"
    },
}))

const SharedArtifacts: React.FC = (() => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {t} = useTranslation("common");


    const { repoId } = useParams<{ repoId: string }>();
    const sharedArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.sharedArtifacts);
    const favoriteArtifacts: Array<ArtifactTO> = useSelector((state: RootState) => state.artifacts.favoriteArtifacts);



    useEffect(() => {
        dispatch(getSharedArtifacts(repoId))
    }, [dispatch, repoId])

    return (
        <>
            <div className={classes.headerText}>
                {t("category.shared")}
            </div>
            {sharedArtifacts.map(artifact => (
                <ArtifactListItem
                    key={artifact.id}
                    artifactTitle={artifact.name}
                    createdDate={artifact.createdDate}
                    updatedDate={artifact.updatedDate}
                    description={artifact.description}
                    repoId={artifact.repositoryId}
                    favorite={helpers.isFavorite(artifact.id, favoriteArtifacts?.map(artifact => artifact.id))}
                    artifactId={artifact.id}
                    fileType={artifact.fileType} />
            ))}
        </>
    );
});
export default SharedArtifacts;