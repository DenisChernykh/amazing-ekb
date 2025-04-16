'use client';

import { useFilter } from '@/hooks/useFilter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useCategories } from '@/hooks/useCategories';

type Category = {
  id: string;
  name: string;
};
type FilterProps = {
  className?: string;
};
function Filter({ className }: FilterProps) {
  const { categories } = useCategories();
  const { setCategory } = useFilter();
  return (
    <Select onValueChange={(value) => setCategory(value)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Выберите категорию" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все</SelectItem>
        {categories?.map((category: Category) => (
          <SelectItem value={category.name} key={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default Filter;
