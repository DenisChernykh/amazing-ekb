import { Button } from "@/components/ui/button";
import { LinkIcon, Wallet } from "lucide-react";

type PostMetaProps = {
  price: string;
  mapUrl: string;
};
const handleMapClick = (url: string) => {
  window.open(url, "_blank");
};

const PostMeta = ({ price, mapUrl }: PostMetaProps) => {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div className="flex gap-2">
        <span className="text-xs font-semibold">
          <Wallet size={16} />
        </span>
        <span className="text-xs font-medium text-blue-600">{price}</span>
      </div>
      <span className="flex w-px self-stretch bg-gray-300"></span>
      <Button
        variant="outline"
        size="sm"
        className="flex grow-1 justify-center"
        onClick={() => handleMapClick(mapUrl)}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PostMeta;
