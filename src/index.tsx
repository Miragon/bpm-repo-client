import i18next from "i18next";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./components/Layout/App";
import "./index.css";
import store from "./store/store";

const language = window.localStorage.getItem("language") ? window.localStorage.getItem("language") : "default";
fetch("/repository/translations/default/common.json", {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
}).then(
    res => {
        return res.json();
    }
).then(data => {
    fetchCustom(data);
});

const fetchCustom = async (defaultLanguage: JSON) => {
    const result = await fetch("/repository/translations/custom/common.json", {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    });
    initI18(defaultLanguage, await result.json());
};

const initI18 = (defaultPackage: JSON, customPackage: JSON) => {
    i18next.use(initReactI18next)
        .init({
            interpolation: { escapeValue: false },
            lng: language ?? "default",
            resources: {
                default: {
                    common: defaultPackage
                },
                custom: {
                    common: customPackage
                }
            }
        });
};

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Suspense fallback="Loading...">
                <I18nextProvider i18n={i18next}>
                    <App />
                </I18nextProvider>
            </Suspense>
        </HashRouter>
    </Provider>
), document.getElementById("root"));
