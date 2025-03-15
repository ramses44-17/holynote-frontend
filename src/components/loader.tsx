import { Pen } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        {/* Logo animé */}
        <div className="relative flex items-center">
          <Pen className="-rotate-90 h-10 w-10 text-red-500 animate-bounce" />
          <h1 className="text-2xl font-bold underline ml-2 text-gray-900 dark:text-white">
            Holy<span className="bg-red-500 text-white px-1 rounded-r-sm">Notes</span>
          </h1>
        </div>

        {/* Animation du loader */}
        <div className="relative w-16 h-16 mt-6">
          <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-gray-300 dark:border-gray-700 border-t-transparent rounded-full animate-spin-slow"></div>
        </div>

        {/* Texte de chargement */}
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Chargement en cours...
        </p>
      </div>
    </div>
  );
}
