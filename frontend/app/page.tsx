"use client";

import { useEffect } from "react";
import EditorialLanding from "@/components/sections/EditorialLanding";

export default function Home() {
  useEffect(() => {
    if (!window.location.hash) {
      window.history.scrollRestoration = "manual";
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }

  }, []);

  return <EditorialLanding />;
}
