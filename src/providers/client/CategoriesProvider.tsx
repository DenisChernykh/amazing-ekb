'use client';
import { CategoriesContext } from '@/context/categories-context';
import { Category } from '@/utils/types';

type CategoriesProviderType = {
  children: React.ReactNode;
  categories: Category[];
};
export default function CategoriesProvider({
  categories,
  children,
}: CategoriesProviderType) {
  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
}
