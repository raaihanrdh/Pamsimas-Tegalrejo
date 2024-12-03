"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, getPermission } from "../utils/routerAuth";
import Navbar from "../components/Nav/navbar";

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const authUser = getAuth();

    setUser(authUser);
  }, []);

  useEffect(() => {
    if (isClient && !user) {
      router.push("/");
    }
  }, [user, isClient, router]);
  if (!isClient || !user) return null;
  return (
    <>
      <Navbar>
        <main>{children}</main>
      </Navbar>
    </>
  );
}
