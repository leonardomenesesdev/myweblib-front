import api from "./api";
import type { RegisterRequest } from "../types/User";

export async function registerUser(payload: RegisterRequest) {
  return api.post("/user/registro", payload);
}
