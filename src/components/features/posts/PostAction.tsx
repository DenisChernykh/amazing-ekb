import { Button } from "@/components/ui/button";

type PostActionProps = {

  postLink: string;
};

const PostAction = ({  postLink }: PostActionProps) => {
  return (
    <Button
      className="block w-full"
      onClick={async () => {
        if (typeof window === "undefined") return;
        const WebApp = (await import("@twa-dev/sdk")).default;
        WebApp.openTelegramLink(postLink);
      }}
    >
      Обзор на канале
    </Button>
  );
};

export default PostAction;
