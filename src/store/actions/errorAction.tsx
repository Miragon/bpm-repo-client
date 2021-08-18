import {defaultErrors} from "../../components/Exception/defaultErrors";
import {HANDLEDERROR} from "../../constants/Constants";
import {ActionType} from "./actions";

// eslint-disable-next-line
export const handleError = (error: any, retryMethod: ActionType, retryPayload: Array<any>) => {
    try {
        switch (error.response.status?.toString()) {
            case "400":
                return {
                    type: HANDLEDERROR,
                    errorMessage: defaultErrors["400"],
                    retryMethod: retryMethod,
                    retryPayload: retryPayload
                };
            case "401":
                return {
                    type: HANDLEDERROR,
                    errorMessage: error.response.data.message,
                    retryMethod: retryMethod,
                    retryPayload: retryPayload
                };
            case "403":
                return {
                    type: HANDLEDERROR,
                    errorMessage: defaultErrors["403"],
                    retryMethod: retryMethod,
                    retryPayload: retryPayload
                };
            case "404":
                return {
                    type: HANDLEDERROR,
                    errorMessage: defaultErrors["404"],
                    retryMethod: retryMethod,
                    retryPayload: retryPayload
                };
            case "409":
                return {
                    type: HANDLEDERROR,
                    errorMessage: error.response.data,
                    retryMethod: retryMethod,
                    retryPayload: retryPayload
                };
            default:
                return {
                    type: HANDLEDERROR,
                    errorMessage: `Error ${error.response.status}`,
                    retryMethod: retryMethod,
                    retryPayload: retryPayload
                };
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return { type: HANDLEDERROR, errorMessage: "error.unknown" };
    }
};
