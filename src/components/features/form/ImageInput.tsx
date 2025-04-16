/* eslint-disable @next/next/no-img-element */
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/schemas";
import { ChangeEvent } from "react";
import { z } from "zod";
import { UseControllerReturn } from "react-hook-form";
import { X, Upload } from "lucide-react";

type FormData = z.infer<typeof formSchema>;
type ImageInputProps = UseControllerReturn<FormData, "images">["field"];

function ImageInput({ ...props }: ImageInputProps) {
  const getFileKey = (file: File) =>
    `${file.name}-${file.size}-${file.lastModified}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const existingFiles = props.value || [];
      const existingKeys = new Set(existingFiles.map(getFileKey));

      const newFilesArray = Array.from(files).filter((file) => {
        const key = getFileKey(file);
        return !existingKeys.has(key);
      });

      const newFiles = [...existingFiles, ...newFilesArray];
      props.onChange(newFiles);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles =
      props.value?.filter(
        (file) => getFileKey(file) !== getFileKey(fileToRemove),
      ) || [];
    props.onChange(updatedFiles);
  };

  return (
    <FormItem>
      <FormLabel className="text-base font-semibold">Изображения</FormLabel>
      <FormControl>
        <Input
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp, image/svg+xml"
          onChange={handleChange}
          id="file-upload"
          className="sr-only"
          style={{ width: 0 }}
        />
      </FormControl>

      <label
        htmlFor="file-upload"
        className="border-primary/30 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed p-6 transition-all"
      >
        <Upload className="text-primary h-8 w-8" strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-primary text-sm font-medium">
            Нажмите для загрузки
          </p>
          <p className="text-muted-foreground text-xs">
            PNG, JPG, WEBP или SVG
          </p>
        </div>
      </label>

      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {props.value?.map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <div
              key={index}
              className="group relative aspect-square w-full overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <img
                src={url}
                alt={`preview-${index}`}
                className="h-full w-full object-cover transition-all group-hover:brightness-90"
                onLoad={() => URL.revokeObjectURL(url)}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-7 w-7 rounded-full p-0 opacity-0 shadow-md transition-all group-hover:opacity-100"
                onClick={() => handleRemoveFile(file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
      <FormMessage />
    </FormItem>
  );
}

export default ImageInput;
