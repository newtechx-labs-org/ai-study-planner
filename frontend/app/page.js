"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  // Redirect on client-side only if not authenticated
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/signin");
    }
  }, [user, router]);
  return <div>Welcome to the Dashboard Home!</div>;
}
