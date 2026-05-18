import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  clearStoredUserId,
  readStoredUserId,
  writeStoredUserId,
} from "../lib/session/auth-storage";

export type AuthState = {
  userId: string | null;
};

const initialStored = typeof window !== "undefined" ? readStoredUserId() : null;

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: initialStored,
  } satisfies AuthState,
  reducers: {
    hydrateAuth(state) {
      state.userId = readStoredUserId();
    },
    setAuthUser(state, action: PayloadAction<string>) {
      state.userId = action.payload;
      writeStoredUserId(action.payload);
    },
    clearAuth(state) {
      state.userId = null;
      clearStoredUserId();
    },
  },
});

export const { hydrateAuth, setAuthUser, clearAuth } = authSlice.actions;

export function selectAuthUserId(state: { auth: AuthState }): string | null {
  return state.auth.userId;
}
