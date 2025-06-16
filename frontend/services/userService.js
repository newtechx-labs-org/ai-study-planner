import api from "@/lib/api";
import { setCredentials, logout } from "@/store/slices/authSlice";
import { dispatch } from "@/store";

export async function signUp(data) {
  try {
    await api.post("/register", data);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.detail || "Signup error",
    };
  }
}

export async function signIn(data) {
  try {
    const res = await api.post(
      "/login",
      {
        email: data.email,
        password: data.password,
      },
      { withCredentials: true } // <== important to send & receive cookies
    );

    const { user, access_token } = res.data;
    dispatch(setCredentials({ user, access_token }));
    return { success: true };
  } catch (err) {
    console.error("Login failed:", err);
    return {
      success: false,
      error: err.response?.data?.detail || "Login error",
    };
  }
}

export async function myProfile(email, password) {
  try {
    const res = await api.get("/profile");

    const { user } = res.data;
    dispatch(setCredentials({ user }));
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.detail || "Login error",
    };
  }
}

export async function signOut() {
  dispatch(logout());
  await api.post("/logout", {}, { withCredentials: true });
}
