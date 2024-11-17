import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user-slice/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
