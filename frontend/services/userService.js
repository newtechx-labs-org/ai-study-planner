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

export async function changePassword(data) {
  try {
    await api.post("/me/change-password", data);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.detail || "Signup error",
    };
  }
}

export async function getMe() {
  try {
    return await api.get("/me");
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.detail || "getMe error",
    };
  }
}

export async function updateMe(data) {
  try {
    return await api.patch("/me", data);
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.detail || "updateMe error",
    };
  }
}

export async function getUserName(id, cache = {}) {
  try {
    if (cache[id]) return cache[id];

    const { data } = await api.get(`/users/${id}/name`);
    cache[id] = data.display_name;
    return cache[id];
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.detail || "getUserName error",
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
      { withCredentials: true }, // <== important to send & receive cookies
    );

    const { user, access_token } = res.data;
    dispatch(setCredentials({ user, access_token }));
    return { user, success: true };
  } catch (err) {
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
    return { success: true, user };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.detail || "Login error",
    };
  }
}

export async function signOut() {
  try {
    await api.post("/logout", {}, { withCredentials: true });
  } finally {
    dispatch(logout());
  }
}
