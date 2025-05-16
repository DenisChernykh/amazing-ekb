import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { usePosts } from "@/hooks/usePosts";
import { formSchema } from "@/schemas";
import { TelegramPost } from "@/utils/types";

import { UseControllerReturn } from "react-hook-form";
import { z } from "zod";
import AutocompleteDropdown from "./AutocompleteDropdown";
import { useAutocomplete } from "@/hooks/useAutocomplete";

type AutocompleteInputProps = React.ComponentProps<"input"> & {
  label: string;
  telegramPosts: TelegramPost[];
} & UseControllerReturn<FormData>["field"];

type FormData = z.infer<typeof formSchema>;
function BindTelegramPostInput({
  label,
  telegramPosts,
  ...props
}: AutocompleteInputProps) {
  const { posts } = usePosts();
  const usedPosts = posts.map((post) => post.telegramPost.postLink);
  const availablePosts = telegramPosts.filter(
    (tgPost) => !usedPosts.includes(tgPost.postLink),
  );

  const {
    setIsOpen,
    inputValue,
    handleFocus,
    handleKeyDown,
    onInputChange,
    isOpen,
    selectPostFromDropdown,
    activeIndex,
  } = useAutocomplete({ availablePosts, onChange: props.onChange });
  const tgPostRef = useOutsideClick(() => setIsOpen(false), true);

  return (
    <FormItem ref={tgPostRef} className="relative mb-5">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          value={inputValue}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onChange={onInputChange}
        />
      </FormControl>
      {isOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto p-1">
            {availablePosts.map((tgPost, index) => {
              return (
                <AutocompleteDropdown
                  key={tgPost.id}
                  index={index}
                  activeIndex={activeIndex}
                  tgPost={tgPost}
                  handleChange={selectPostFromDropdown}
                />
              );
            })}
          </div>
        </div>
      )}
      <FormMessage />
    </FormItem>
  );
}

export default BindTelegramPostInput;
