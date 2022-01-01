import {applyMiddleware, createStore} from "@reduxjs/toolkit";
import {composeWithDevTools} from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import {rootReducer} from "./reducers/rootReducer";

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));

export type RootState = ReturnType<typeof rootReducer>;
export type RootDispatch = typeof store.dispatch;

export default store;
