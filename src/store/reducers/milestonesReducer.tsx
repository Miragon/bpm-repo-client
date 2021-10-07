import {CaseReducer} from "@reduxjs/toolkit";
import {ArtifactMilestoneTO} from "../../api";
import {ACTIVE_MILESTONES, DEPLOYMENT_MILESTONES} from "../../constants/Constants";

const initialState = {
    activeMilestones: Array<ArtifactMilestoneTO>(),
    latestMilestone: null,
    deploymentMilestones: Array<Array<ArtifactMilestoneTO>>()
};

const reducer: CaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVE_MILESTONES:
            return {
                ...state,
                activeMilestones: action.activeMilestones
            };

        case DEPLOYMENT_MILESTONES:
            return {
                ...state,
                deploymentMilestones: [...state.deploymentMilestones, action.deploymentMilestones]

            }
    }
    return state;
};

export default reducer;
