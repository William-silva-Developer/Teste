import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUserProps } from "../../interfaces/user";

const initialState = {
  user: {
    uid: "",
    name: "",
    email: "",
    isAutenticated: false,
  } as IUserProps,
  loadingAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authenticatedUser: (state, action: PayloadAction<IUserProps>) => {
      console.log("Slice: ", action.payload);
      return {
        ...state,
        user: {
          uid: action.payload.uid,
          name: action.payload.name,
          email: action.payload.email,
          isAutenticated: action.payload.isAutenticated,
        },
      };
    },
    deauthenticatedUser: (state) => {
      return {
        ...state,
        user: {
          uid: "",
          name: "",
          email: "",
          isAutenticated: false,
        },
      };
    },
  },
});

export const { authenticatedUser, deauthenticatedUser } = userSlice.actions;
export default userSlice.reducer;
