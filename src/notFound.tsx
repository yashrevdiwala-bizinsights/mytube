import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center w-screen
    "
    >
      <AlertTriangle className="w-16 h-16 text-red-500" />
      <h1 className="text-4xl font-bold mt-4">404 - Page Not Found</h1>
      <p className="text-gray-400 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
      >
        <span className="text-white">Go Home</span>
      </Link>
    </div>
  );
}
