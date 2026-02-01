import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (context) {
    return context;
  } else {
    throw new Error("must be used within AuthProvider");
  }
}
