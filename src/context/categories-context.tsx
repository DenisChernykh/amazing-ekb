'use client';
import { Category } from '@/utils/types';
import { createContext } from 'react';

type CategoriesContextType = {
  categories: Category[] | null;
};

export const CategoriesContext = createContext<CategoriesContextType>({
  categories: null,
});
