import { Button } from "@/components/ui/button";
import { FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/schemas";
import { X } from "lucide-react";
import Image from "next/image";
import { UseControllerReturn } from "react-hook-form";
import { z } from "zod";
type FormData = z.infer<typeof formSchema>;
type TgImagesInputType = React.ComponentProps<"input"> &
  UseControllerReturn<FormData, "tgImages">["field"];

function TgImagesInput({ ...props }: TgImagesInputType) {
  const handleRemoveFile = (image: string) => {
    const updatedFiles = props.value?.filter((img) => img !== image) || [];
    props.onChange(updatedFiles);
  };
  return (
    <FormItem>
      <FormControl>
        <Input {...props} type="hidden" />
      </FormControl>
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {props.value.map((image, index) => {
          return (
            <div
              key={index}
              className="group relative aspect-square w-full overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <Image
                fill
                src={image}
                alt={`preview-${index}`}
                className="h-full w-full object-cover transition-all group-hover:brightness-90"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-7 w-7 rounded-full p-0 opacity-0 shadow-md transition-all group-hover:opacity-100"
                onClick={() => handleRemoveFile(image)}
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
