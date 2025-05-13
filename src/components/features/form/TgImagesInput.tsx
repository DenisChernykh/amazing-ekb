import { Button } from "@/components/ui/button";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/schemas";
import { ImageType } from "@/utils/types";
import { X } from "lucide-react";
import Image from "next/image";
import { UseControllerReturn } from "react-hook-form";
import { z } from "zod";
type FormData = z.infer<typeof formSchema>;
type TgImagesInputType = React.ComponentProps<"input"> &
  UseControllerReturn<FormData, "tgImages">["field"];
type TgImagesInputProps = TgImagesInputType & { allImages: ImageType[] };
function TgImagesInput({ allImages, ...props }: TgImagesInputProps) {
  console.log(allImages);
  const displayImages = props.value.map((id) => {
    const img = allImages.find((img) => img.id === id);
    return { id, path: img?.path || "" };
  });

  const handleRemoveFile = (idToRemove: string) => {
    const updated = props.value.filter((id) => id !== idToRemove);
    props.onChange(updated);
  };
  return (
    <FormItem>
      <FormControl>
        <Input {...props} type="hidden" />
      </FormControl>
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {displayImages.map((image, index) => {
          return (
            <div
              key={index}
              className="group relative aspect-square w-full overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <Image
                fill
                src={image.path || "/placeholder-image.jpg"}
                alt={`preview-${index}`}
                className="h-full w-full object-cover transition-all group-hover:brightness-90"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-7 w-7 rounded-full p-0 opacity-0 shadow-md transition-all group-hover:opacity-100"
                onClick={() => image.path && handleRemoveFile(image.path)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </FormItem>
  );
}

export default TgImagesInput;
