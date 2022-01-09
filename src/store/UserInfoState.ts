import { UserApi } from "../api";
import createObjectApiState from "./lib/ObjectApiState";

const [
    UserInfoSlice,
    loadUserInfo,
    updateUserInfo
] = createObjectApiState({
    name: "UserInfo",
    execute: () => new UserApi().getUserInfo(),
    cacheTimeout: 60
});

export {
    UserInfoSlice,
    loadUserInfo,
    updateUserInfo
};
