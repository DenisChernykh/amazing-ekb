import { getCategories } from '@/lib/actions/category.actions';
import Filter from './Filter';
// type HeaderProps = {
//   className?: string;
//   children?: React.ReactNode;

// };
async function Header() {
  const categories = (await getCategories()) || [];
  return (
    <header className=" bg-muted min-h-16  ">
      <div className="p-4 container">
        <Filter className=" bg-white" categories={categories} />
      </div>
    </header>
  );
}

export default Header;
