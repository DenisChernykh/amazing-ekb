'use client';

import { useFilter } from '@/hooks/useFilter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type Category = {
  id: string;
  name: string;
};
type FilterProps = {
  categories: Category[];
  className?: string;
};
function Filter({ categories, className }: FilterProps) {
  const { setCategory } = useFilter();
  return (
    <Select onValueChange={(value) => setCategory(value)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Выберите категорию" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Все</SelectItem>
        {categories.map((category) => (
          <SelectItem value={category.name} key={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ); 
}

export default Filter;
