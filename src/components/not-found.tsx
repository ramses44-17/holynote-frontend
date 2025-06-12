import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";
import { Pen } from "lucide-react";
import { useUserStore } from "@/stores/user-store";

export default function NotFound() {
  const { user } = useUserStore();
  return (
    <div className="flex items-center justify-center min-h-screen flex-col bg-gray-100 dark:bg-gray-900 text-center p-6">
      {/* Logo */}
      <Link
        to={user ? "/notes" : "/auth"}
        className="flex items-center mb-6 text-gray-900 dark:text-white"
      >
        <Pen className="-rotate-90 h-8 w-8 text-red-500" />
        <h1 className="text-2xl font-bold underline">
          Holy
          <span className="bg-red-500 text-white px-1 rounded-r-sm">Notes</span>
        </h1>
      </Link>

      {/* Message d'erreur */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Page Introuvable
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        {/* Bouton de retour */}
        <Link
          to={user ? "/notes" : "/auth"}
          className="mt-6 inline-block px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
