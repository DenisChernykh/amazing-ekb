'use client';

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
  onFilterChange: (category: string) => void;
};
function Filter({ categories, className, onFilterChange }: FilterProps) {
  return (
    <Select onValueChange={(value) => onFilterChange(value)}>
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
