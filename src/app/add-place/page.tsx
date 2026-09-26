import CreatePostForm from "@/components/features/form/CreatePostForm";
import { getTelegramPosts } from "@/adapters";
import { isCurrentUserAdmin } from '@/lib/require-admin';
import { redirect } from 'next/navigation';

async function page() {
  if (!await isCurrentUserAdmin()) redirect('/');
  const telegramPosts = (await getTelegramPosts()) || [];
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Добавить пост</h1>
      <CreatePostForm telegramPosts={telegramPosts} />
    </div>
  );
}

export default page;
