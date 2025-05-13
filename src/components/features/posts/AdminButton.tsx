"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export default function AdminButton() {
  const { isAdmin, loading, user } = useIsAdmin();
  console.log(user);

  if (loading || !isAdmin) return null;

  return (
    <Button className="mb-4">
      <Link href="/add-place">Добавить пост</Link>
    </Button>
  );
}
