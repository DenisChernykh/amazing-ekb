"use client";
import { usePathname } from "next/navigation";
import Filter from "./Filter";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  return (
    <header className="bg-muted flex min-h-16 items-center">
      <div className="container mx-auto flex items-center p-4">
        {isHomePage && <Filter className="bg-white" />}
        {!isHomePage && (
          <>
            <Button
              asChild
              onClick={() => router.back()}
              variant="link"
              className="cursor-pointer gap-0 px-0 py-0 hover:no-underline has-[>svg]:px-0"
            >
              <div className="flex items-center">
                <ChevronLeft
                  style={{
                    width: 32,
                    height: 32,
                    display: "block",
                    marginLeft: "-8px",
                  }}
                  strokeWidth={2}
                  className="text-primary"
                />
                <span className="text-2xl">Назад</span>
              </div>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
