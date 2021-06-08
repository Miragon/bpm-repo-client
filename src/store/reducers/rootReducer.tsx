import {combineReducers} from "@reduxjs/toolkit";
import diagramReducer from "./recentDiagramsReducer";
import repoReducer from "./repositoriesReducer";
import favoriteDiagramReducer from "./favoriteDiagramsReducer"
import uploadDiagramReducer from "./uploadDiagramReducer";
import apiResponseReducer from "./apiResponseReducer";
import dataSyncedReducer from "./dataSyncedReducer";
import activeRepoReducer from "./activeRepoReducer";
import activeDiagramsReducer from "./activeDiagramsReducer";
import versionsReducer from "./versionsReducer";
import apiResponseWithRetryReducer from "./apiResponseWithRetryReducer";

export const rootReducer = combineReducers({
    recentDiagrams: diagramReducer,
    favoriteDiagrams: favoriteDiagramReducer,
    repos: repoReducer,
    uploadedDiagram: uploadDiagramReducer,
    api: apiResponseReducer,
    apiWithRetry: apiResponseWithRetryReducer,
    dataSynced: dataSyncedReducer,
    activeRepo: activeRepoReducer,
    activeDiagrams: activeDiagramsReducer,
    versions: versionsReducer
})

export type RootState = ReturnType<typeof rootReducer>