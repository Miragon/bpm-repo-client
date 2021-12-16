import { AxiosResponse } from "axios";
import { ArtifactApi, ArtifactTypeTO } from "../../api";
import { getClientConfig } from "../../api/config";

export const fetchFileTypes = async (): Promise<AxiosResponse<ArtifactTypeTO[]>> => {
    const menuController = new ArtifactApi();
    const config = getClientConfig();
    return menuController.getAllFileTypes(config);
};
