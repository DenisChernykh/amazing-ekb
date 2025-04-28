"use client";

import { FormField, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/schemas";
import { createPost } from "@/actions/post/createPost";
import FormTextInput from "./FormTextInput";
import ImageInput from "./ImageInput";
import AutocompleteInput from "./AutocompleteInput";
import BindTelegramPostInput from "./BindTelegramPostInput";
import { TelegramPost } from "@/utils/types";
import TgImagesInput from "./TgImagesInput";

type CreatePostFormProps = {
  telegramPosts: TelegramPost[];
};
function CreatePostForm({ telegramPosts }: CreatePostFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Hotel",
      price: "500-1000",
      mapUrl: "https://map.ru",
      images: undefined,
      category: "",
      telegramPost: "",
      tgImages: [],
      publishedAt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("price", String(values.price));
      formData.append("mapUrl", values.mapUrl);
      formData.append("category", values.category);
      formData.append("telegramPost", values.telegramPost);
      formData.append("publishedAt", values.publishedAt);
      if (values.images) {
        if (Array.isArray(values.images)) {
          values.images.forEach((file) => formData.append("images", file));
        } else {
          formData.append("images", values.images);
        }
      }
      formData.append("tgImages", JSON.stringify(values.tgImages));
      await createPost(formData);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <FormTextInput
          control={form.control}
          name="title"
          label="Место"
          placeholder="Введите название"
        />
        <FormTextInput
          control={form.control}
          name="price"
          label="Средний чек"
          placeholder="Введите сумму"
        />
        <FormTextInput
          control={form.control}
          name="mapUrl"
          label="Ссылка на карте"
          placeholder="https://..."
          type="url"
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => <ImageInput {...field} />}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <AutocompleteInput label="Категория" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="telegramPost"
          render={({ field }) => (
            <BindTelegramPostInput
              telegramPosts={telegramPosts}
              label="Связать с постом"
              setValue={form.setValue}
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="tgImages"
          render={({ field }) => <TgImagesInput {...field} />}
        />
        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => <input {...field} type="hidden" />}
        />

        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Создание..." : "Создать пост"}
        </Button>
      </form>
    </Form>
  );
}

export default CreatePostForm;
