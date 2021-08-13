import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllSharedArtifacts, getByRepositoryIdAndType} from "../../../store/actions";
import {RootState} from "../../../store/reducers/rootReducer";
import ArtifactListItem from "./ArtifactListItem";
import helpers from "../../../constants/Functions";
import {ArtifactTO} from "../../../api";
import {useParams} from "react-router";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";


const useStyles = makeStyles(() => ({
    headerText: {
        color: "black",
        fontSize: "20px"
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
        dispatch(getAllSharedArtifacts())
    }, [dispatch, repoId])

    return (
        <>
            <div className={classes.headerText}>
                {t("shared")}
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