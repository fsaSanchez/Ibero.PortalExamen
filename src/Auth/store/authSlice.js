import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isAuthenticated: false,
  mapping: {},
  routes: [],
  profile: {},
  profileId: null,
  profilesApp: [],
  isAdmin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      const { token, mapping, perfil, profileId } = payload;
      state.token = token;
      state.isAuthenticated = true;
      state.mapping = mapping;
      state.profile = perfil;
      state.profileId = profileId;
      state.isAdmin = Number(profileId) === 440;
    },
    // loginCheckingFinish: (state) => {
    //   state.checking = true;
    // },
    logout: (state) => {
      Object.assign(state, initialState);
    },
    setProfilesInfo: (state, { payload }) => {
      state.profilesApp = payload;
    },
    setMenuProfile: (state, { payload }) => {
      state.routes = payload;      
    },
  },
});

export const {
  login,
  logout,
  setProfilesInfo,
  setMenuProfile,
  loginCheckingFinish,
} = authSlice.actions;
