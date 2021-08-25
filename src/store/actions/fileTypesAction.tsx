import helpers from "../../util/helperFunctions";
import {ArtifactApi} from "../../api";

export const fetchFileTypes = async () => {
    const menuController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await menuController.getAllFileTypes(config);
    return response;
}
//TODO :                 dispatch({type: FILETYPES, fileTypes: response.data})
