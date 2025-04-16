import CreatePostForm from "@/components/features/form/CreatePostForm";
import { getTelegramPosts } from "@/repositories";

async function page() {
  const telegramPosts = (await getTelegramPosts()) || [];
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Добавить пост</h1>
      <CreatePostForm telegramPosts={telegramPosts} />
    </div>
  );
}

export default page;
