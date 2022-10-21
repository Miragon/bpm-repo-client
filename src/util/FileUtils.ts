import { ArtifactMilestoneTO } from "../api";

const BASE_PATH = process.env.REACT_APP_BACKEND ?? "";

export const downloadFile = (milestone: ArtifactMilestoneTO): void => {
    const filePath = `${BASE_PATH}/api/milestone/${milestone.artifactId}/${milestone.id}/download`;
    download(filePath);
};

export const downloadProject = (repositoryId: string): void => {
    const filePath = `${BASE_PATH}/api/repo/${repositoryId}/download`;
    download(filePath);
};


//------------------------------ HELPER METHODS ------------------------------//

const download = (filePath: string): void => {
    const link = document.createElement("a");
    link.href = filePath;
    link.click();
}
