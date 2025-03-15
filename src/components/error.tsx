import { Pen } from 'lucide-react'

export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col bg-gray-100 dark:bg-gray-900 text-center p-6">
              {/* Logo */}
              <div className="flex items-center mb-6 text-gray-900 dark:text-white">
                <Pen className="-rotate-90 h-8 w-8 text-red-500" />
                <h1 className="text-2xl font-bold underline">
                  Holy<span className="bg-red-500 text-white px-1 rounded-r-sm">Notes</span>
                </h1>
              </div>
      
              {/* Message d'erreur */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Oups !</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Une erreur est survenue. Veuillez actualiser la page ou vérifier votre connexion.
                </p>
      
                {/* Bouton d'actualisation */}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition"
                >
                  Réessayer
                </button>
              </div>
            </div>
  )
}
