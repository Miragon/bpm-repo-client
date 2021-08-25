import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers/rootReducer";
import helpers from "../../../util/helperFunctions";
import {ArtifactTO} from "../../../api";
import {useParams} from "react-router";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import ArtifactListItem from "./Holder/ArtifactListItem";
import {getSharedArtifacts} from "../../../store/actions/ShareAction";
import {SHARED_ARTIFACTS} from "../../../constants/Constants";


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



    const getShared = useCallback(async (repoId: string) => {
        getSharedArtifacts(repoId).then(response => {
            if(Math.floor(response.status / 100) === 2){
                dispatch({type: SHARED_ARTIFACTS, sharedArtifacts: response.data})
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => getShared(repoId))
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => getShared(repoId))
        })
    }, [dispatch, t])
    
    useEffect(() => {
        getShared(repoId)
    }, [getShared, repoId])

    return (
        <>
            <div className={classes.headerText}>
                {t("category.shared")}
            </div>
            {sharedArtifacts.length > 0 ? 
                sharedArtifacts.map(artifact => (
                    <ArtifactListItem
                        key={artifact.id}
                        artifactTitle={artifact.name}
                        createdDate={artifact.createdDate}
                        updatedDate={artifact.updatedDate}
                        description={artifact.description}
                        repoId={artifact.repositoryId}
                        favorite={helpers.isFavorite(artifact.id, favoriteArtifacts?.map(artifact => artifact.id))}
                        artifactId={artifact.id}
                        fileType={artifact.fileType} /> ))
                :
                <span>{t("share.na")}</span>
            }
        </>
    );
});
export default SharedArtifacts;