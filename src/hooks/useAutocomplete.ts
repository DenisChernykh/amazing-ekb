import { TelegramPost } from "@/utils/types";
import { useEffect, useState } from "react";
import { useFormState } from "react-hook-form";
type useAutocompleteProps = {
	availablePosts: TelegramPost[];
	onChange: (value: string) => void;
}
export const useAutocomplete = ({ availablePosts, onChange }: useAutocompleteProps) => {
	const [activeIndex, setActiveIndex] = useState<number>(-1);
	const [inputValue, setInputValue] = useState<string>("");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { isSubmitSuccessful } = useFormState();
	useEffect(() => {
		if (isSubmitSuccessful) {
			setInputValue("");
		}
	}, [isSubmitSuccessful]);
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (isOpen) return;
		switch (e.key) {
			case "ArrowDown": {
				e.preventDefault();
				setActiveIndex((prev) =>
					prev < availablePosts.length - 1 ? prev + 1 : 0,
				);
				break;
			}
			case "ArrowUp": {
				e.preventDefault();
				setActiveIndex((prev) =>
					prev > 0 ? prev - 1 : availablePosts.length - 1,
				);
				break;
			}
			case "Enter": {
				if (activeIndex !== -1) {
					const selected = availablePosts[activeIndex];
					onChange(selected.id);
					setInputValue(selected.postLink);
					setIsOpen(false);
				}
				break;
			}
			case "Escape": {
				setIsOpen(false);
				break;
			}
			default:
				break;
		}
	};
	const handleFocus = () => {
		setIsOpen(true);
		setActiveIndex(-1);
	};
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
		setIsOpen(true);
		setActiveIndex(-1);
	};

	const selectPostFromDropdown
 = (postId: string, postLink: string) => {
		onChange(postId);
		setInputValue(postLink);
		setIsOpen(false);
	};
	return { setIsOpen, inputValue, handleFocus, handleKeyDown, onInputChange, isOpen, activeIndex, selectPostFromDropdown
 }
}