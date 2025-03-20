import { Search, User } from "lucide-react";

export const Navbar = () => {
  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white fixed top-0 left-0 w-full z-10">
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 px-4 py-2 rounded-md focus:outline-none"
          />
        </div>
        <User className="w-6 h-6" />
      </header>
    </div>
  );
};
