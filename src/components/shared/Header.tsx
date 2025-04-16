import Filter from './Filter';

async function Header() {
  return (
    <header className=" bg-muted min-h-16  ">
      <div className="p-4 mx-auto container">
        <Filter className=" bg-white" />
      </div>
    </header>
  );
}

export default Header;
