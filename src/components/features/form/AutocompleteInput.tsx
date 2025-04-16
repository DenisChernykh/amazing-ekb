import { createCategory } from "@/actions/categories/createCategory";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useCategories";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { formSchema } from "@/schemas";
import { useState } from "react";
import { UseControllerReturn } from "react-hook-form";
import { z } from "zod";
type AutocompleteInputProps = {
  label: string;
} & UseControllerReturn<FormData>["field"];

type FormData = z.infer<typeof formSchema>;
function AutocompleteInput({ label, ...props }: AutocompleteInputProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const { categories } = useCategories() || [];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const categoryRef = useOutsideClick(() => setIsOpen(false), true);
  const filteredCategories = categories.filter((category) =>
    category.name
      .toLowerCase()
      .includes((String(props.value) || "").toLowerCase()),
  );

  const showCreateOption =
    props.value &&
    !categories.some(
      (category) =>
        category.name.toLowerCase() === String(props.value).toLowerCase(),
    );

  const handleCreateCategory = async () => {
    await createCategory(String(props.value));
  };

  return (
    <FormItem ref={categoryRef} className="relative mb-5">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          value={String(props.value)}
          type="text"
          onFocus={() => {
            setIsOpen(true);
            setActiveIndex(-1); // сбросить активный индекс
          }}
          onKeyDown={(e) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((prev) =>
                prev < filteredCategories.length - 1 ? prev + 1 : 0,
              );
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : filteredCategories.length - 1,
              );
            }

            if (e.key === "Enter" && activeIndex !== -1) {
              e.preventDefault();
              const selected = filteredCategories[activeIndex];
              if (selected) {
                props.onChange({ target: { value: selected.name } });
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
            setActiveIndex(-1); // сброс при новом вводе
          }}
        />
      </FormControl>
      {isOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {filteredCategories.length > 0 ? (
            <div className="max-h-60 overflow-auto p-1">
              {filteredCategories.map((category, index) => {
                return (
                  <div
                    className={`cursor-pointer px-4 py-2 transition-colors ${
                      index === activeIndex
                        ? "bg-gray-200 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                    key={category.id}
                    onClick={() => {
                      props.onChange(category.name);
                      setIsOpen(false);
                    }}
                  >
                    {category.name}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="cursor-pointer px-4 py-2 transition-colors hover:bg-gray-100">
              Нет совпадений
            </div>
          )}
          {showCreateOption && (
            <div
              onClick={() => {
                handleCreateCategory();
                setIsOpen(false);
              }}
              className="cursor-pointer border-t border-gray-200 bg-blue-50 px-4 py-2 font-medium text-blue-600 hover:bg-blue-100"
            >
              Создать &quot;{String(props.value)}&quot;
            </div>
          )}
        </div>
      )}
      <FormMessage />
    </FormItem>
  );
}

export default AutocompleteInput;
