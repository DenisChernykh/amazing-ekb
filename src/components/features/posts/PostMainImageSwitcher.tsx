import { useIsAdmin } from "@/hooks/useIsAdmin";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

type PostMainImageSwitcherProps = {
  className?: string;
  isMain: boolean;
  onClick: () => void;
};

const PostMainImageSwitcher = ({
  className,
  onClick,
  isMain,
}: PostMainImageSwitcherProps) => {
  const { isAdmin, loading } = useIsAdmin();
  const isDevelopment = process.env.NODE_ENV === "development";
  if ((loading || !isAdmin) && !isDevelopment) return null;
  return (
    <div className={cn(className, "absolute top-5 left-5 z-10 cursor-pointer")}>
      <Crown
        className={cn(isMain ? "fill-yellow-400" : "fill-transparent")}
        onClick={onClick}
        stroke="oklch(85.2% 0.199 91.936)"
      />
    </div>
  );
};

export default PostMainImageSwitcher;
