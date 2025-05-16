"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export default function AdminButton() {
  const { isAdmin, loading } = useIsAdmin();

  const isDevelopment = process.env.NODE_ENV === "development";
  if ((loading || !isAdmin) && !isDevelopment) return null;

  return (
    <Button className="mb-4">
      <Link href="/add-place">Добавить пост</Link>
    </Button>
  );
}
