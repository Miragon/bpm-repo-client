import {applyMiddleware, createStore} from "@reduxjs/toolkit";
import {rootReducer} from "./reducers/rootReducer";
import ReduxThunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)))


export default store