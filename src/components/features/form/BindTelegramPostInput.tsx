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
import { useState } from "react";
import { UseControllerReturn } from "react-hook-form";
import { z } from "zod";
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
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [inputValue, setInputValue] = useState<string>("");
  const { posts } = usePosts();
  const existingTgPostUrl = posts.map((post) => post.telegramPost.postLink);
  const filteredTelegramPosts = telegramPosts.filter(
    (tgPost) => !existingTgPostUrl.includes(tgPost.postLink),
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const tgPostRef = useOutsideClick(() => setIsOpen(false), true);
  return (
    <FormItem ref={tgPostRef} className="relative mb-5">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          value={inputValue}
          onFocus={() => {
            setIsOpen(true);
            setActiveIndex(-1); // сбросить активный индекс
          }}
          onKeyDown={(e) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((prev) =>
                prev < filteredTelegramPosts.length - 1 ? prev + 1 : 0,
              );
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : filteredTelegramPosts.length - 1,
              );
            }

            if (e.key === "Enter" && activeIndex !== -1) {
              e.preventDefault();
              const selected = filteredTelegramPosts[activeIndex];
              if (selected) {
                props.onChange({ target: { value: selected.text } });
                setIsOpen(false);
              }
            }

            if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
          onChange={(e) => {
            props.onChange(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
        />
      </FormControl>
      {isOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto p-1">
            {filteredTelegramPosts.map((tgPost, index) => {
              return (
                <div
                  className={`cursor-pointer px-4 py-2 transition-colors ${
                    index === activeIndex
                      ? "bg-gray-200 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                  key={tgPost.id}
                  onClick={() => {
                    props.onChange(tgPost.id);
                    setInputValue(tgPost.postLink);
                    setIsOpen(false);
                  }}
                >
                  {tgPost.text.slice(0, 50)}
                </div>
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
