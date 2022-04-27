import { ArtifactMilestoneTO } from "../api";

const BASE_PATH = process.env.REACT_APP_BACKEND ?? "";

export const downloadFile = (milestone: ArtifactMilestoneTO): void => {
    const filePath = `${BASE_PATH}/api/milestone/${milestone.artifactId}/${milestone.id}/download`;
    const link = document.createElement("a");
    link.href = filePath;
    link.click();
};
