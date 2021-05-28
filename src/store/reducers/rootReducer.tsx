import {combineReducers} from "@reduxjs/toolkit";
import diagramReducer from "./recentDiagramsReducer";
import repoReducer from "./repositoriesReducer";
import favoriteDiagramReducer from "./favoriteDiagramsReducer"
import uploadDiagramReducer from "./uploadDiagramReducer";
import apiResponseReducer from "./apiResponseReducer";
import dataSyncedReducer from "./dataSyncedReducer";
import activeRepoReducer from "./activeRepoReducer";
import activeDiagramsReducer from "./activeDiagramsReducer";

export const rootReducer = combineReducers({
    recentDiagrams: diagramReducer,
    favoriteDiagrams: favoriteDiagramReducer,
    repos: repoReducer,
    uploadedDiagram: uploadDiagramReducer,
    api: apiResponseReducer,
    dataSynced: dataSyncedReducer,
    activeRepo: activeRepoReducer,
    activeDiagrams: activeDiagramsReducer
})

export type RootState = ReturnType<typeof rootReducer>