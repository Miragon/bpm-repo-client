import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {Provider} from "react-redux";
import {HashRouter} from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import App from "./components/Layout/App";
import store from "./store/store";
import {I18nextProvider, initReactI18next} from "react-i18next";
import i18next from "i18next";


const language = window.localStorage.getItem("language") ? window.localStorage.getItem("language") : "default";
fetch("/translations/default/common.json"
    ,{
        headers : {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }
).then(
    function(res){
        return res.json()
    }).then(function(data){
    const defaultPackage = data
    fetchCustom(defaultPackage)
}).catch(
    function(err){
        console.log(err)
    }
)


const fetchCustom = (defaultPackage: JSON) => {
    fetch("/translations/custom/common.json"
        ,{
            headers : {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
    ).then(
        function(res){
            return res.json()
        }).then(function(data){
        const customPackage = data
        initI18(defaultPackage, customPackage)
    }).catch(
        function(err){
            console.log(err)
        }
    )
}


const initI18 = (defaultPackage: JSON, customPackage: JSON) => {
    i18next
        .use(initReactI18next)
        .init({
            interpolation: { escapeValue: false },
            lng: language ? language : "default" ,
            resources: {
                default: {
                    common: defaultPackage
                },
                custom: {
                    common: customPackage
                }
            }
        });
}




ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Suspense fallback={"loading"}>
                <I18nextProvider i18n={i18next}>
                    <App />
                </I18nextProvider>
            </Suspense>
        </HashRouter>
    </Provider>
),
document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
