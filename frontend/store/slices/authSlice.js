import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload;
      if (access_token) {
        state.access_token = access_token;
      }
      if (user && Object.keys(user).length) {
        state.user = user;
        state.role = user.role;
      }
    },
    logout: (state) => {
      state.access_token = null;
      state.user = null;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
