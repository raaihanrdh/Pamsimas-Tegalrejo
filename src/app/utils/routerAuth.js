import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function setAuth(user) {
  Cookies.set("user", JSON.stringify(user));
}

export function getAuth() {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
}

export function getPermission(parent) {
  const user = Cookies.get(`user.permissions`);
  return user ? JSON.parse(user) : null;
}

export function clearAuth() {
  Cookies.remove("user");
}

export function withAuth(Component) {
  return function AuthenticatedRoute(props) {
    const [isClient, setIsClient] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
      setIsClient(true);
      const authUser = getAuth();
      setUser(authUser);

      // Redirect if no user found
      if (!authUser) {
        window.location.href = "/";
      }
    }, []);

    if (!isClient) {
      return null;
    }

    return <Component {...props} />;
  };
}
