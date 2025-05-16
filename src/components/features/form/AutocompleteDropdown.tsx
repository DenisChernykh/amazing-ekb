import { TelegramPost } from "@/utils/types";

type AutocompleteDropdownProps = {
  tgPost: TelegramPost;
  activeIndex: number;
  index: number;
  handleChange: (postId: string, postLink: string) => void;
};

const AutocompleteDropdown = ({
  index,
  tgPost,
  activeIndex,
  handleChange,
}: AutocompleteDropdownProps) => {
  return (
    <div
      className={`cursor-pointer px-4 py-2 transition-colors ${
        index === activeIndex ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
      }`}
      key={tgPost.id}
      onClick={() => {
        handleChange(tgPost.id, tgPost.postLink);
      }}
    >
      {tgPost.text.slice(0, 50)}
    </div>
  );
};

export default AutocompleteDropdown;
