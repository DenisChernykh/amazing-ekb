'use client';
import { createContext } from 'react';

type FilterContextType = {
  category: string | null;
  setCategory: (category: string | null) => void;
};

export const FilterContext = createContext<FilterContextType>({
  category: null,
  setCategory: () => {},
});
