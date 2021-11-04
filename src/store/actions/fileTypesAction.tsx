import {ArtifactApi, ArtifactTypeTO} from "../../api";
import {AxiosResponse} from "axios";
import {getClientConfig} from "../../api/config";

export const fetchFileTypes = async (): Promise<AxiosResponse<ArtifactTypeTO[]>> => {
    const menuController = new ArtifactApi();
    const config = getClientConfig();
    return await menuController.getAllFileTypes(config);
}
