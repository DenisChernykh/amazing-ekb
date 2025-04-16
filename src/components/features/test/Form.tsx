'use client';
import { createCategory } from '@/actions/categories/createCategory';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Category } from '@/utils/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormProps {
  categories: Category[];
}

function Form({ categories }: FormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const categoryRef = useOutsideClick(() => setIsOpen(false), true);
  const currentCategory = watch('category') || '';

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(currentCategory.toLowerCase())
  );

  const showCreateOption =
  currentCategory &&
  !categories.some(
    (category) => category.name.toLowerCase() === currentCategory.toLowerCase()
  );
  const handleCreateCategory = async () => {
    const result = await createCategory(currentCategory);
    console.log(result);
  };
  return (
    <div ref={categoryRef} className="mb-5 relative">
      <Label htmlFor="category" className="block mb-2 text-sm font-medium">
        Категория
      </Label>
      <Input
        id="category"
        className="w-full"
        {...register('category', {
          required: { value: true, message: 'Category is required' },
        })}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setValue('category', e.target.value);
          setIsOpen(true);
        }}
      />

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {/* Existing categories */}
          {filteredCategories.length > 0 ? (
            <div className="py-1 max-h-60 overflow-auto">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => {
                    setValue('category', category.name);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  {category.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-gray-500">Нет совпадений</div>
          )}

          {/* Create new category option */}
          {showCreateOption && (
            <div
              onClick={() => {
                handleCreateCategory();
                setIsOpen(false);
              }}
              className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer border-t border-gray-200 font-medium"
            >
              Создать &quot;{currentCategory}&quot;
            </div>
          )}
        </div>
      )}

      {errors?.category?.message && (
        <p className="mt-1 text-sm text-red-500">
          {typeof errors.category.message === 'string'
            ? errors.category.message
            : ''}
        </p>
      )}
    </div>
  );
}

export default Form;
