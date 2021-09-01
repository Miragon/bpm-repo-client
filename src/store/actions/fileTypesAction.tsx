import helpers from "../../util/helperFunctions";
import {ArtifactApi, ArtifactTypeTO} from "../../api";
import {AxiosResponse} from "axios";

export const fetchFileTypes = async (): Promise<AxiosResponse<ArtifactTypeTO[]>> => {
    const menuController = new ArtifactApi();
    const config = helpers.getClientConfig();
    const response = await menuController.getAllFileTypes(config);
    return response;
}
