'use client';
import { FilterContext } from '@/context/filter-context';
import { useState } from 'react';

export default function FilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [category, setCategory] = useState<string | null>('all');
  return (
    <FilterContext.Provider value={{ category, setCategory }}>
      {children}
    </FilterContext.Provider>
  );
}
