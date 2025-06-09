import { useState, useEffect } from "react";
import Header, { MainMode } from "@/components/header";
import NoteCard from "@/components/note-card";
import { Link, Navigate } from "react-router";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Error from "@/components/error";
import Loader from "@/components/loader";
import NewNoteCard from "@/components/new-note-button";
import { apiBaseUrl } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersect-observer";
import { NotesResponse } from "@/types/types";
import { useAuth } from "@/hooks/use-auth";
import { useUserStore } from "@/stores/app-store";

const fetchNotes = async ({
  pageParam = 1,
  searchTerm,
  accessToken
}: {
  pageParam?: number;
  searchTerm: string;
  accessToken:string | null;
}) => {
  const response = await axios.get(`${apiBaseUrl}/notes`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // 👈 Ajout manuel ici
    },
    params: {
      page: pageParam,
      search:searchTerm,
    },
  });
  return response.data; // { notes, total, currentPage, totalPage }
};

export default function NotesPage() {
  const [mainMode, setMainMode] = useState<MainMode>("view");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {accessToken} = useUserStore()
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<NotesResponse, Error>({
    queryKey: ["notes", debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) =>
      fetchNotes({ pageParam:pageParam as number, searchTerm: debouncedSearchTerm,accessToken }),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    enabled: mainMode === "search" || mainMode === "view",
    initialPageParam: 1,
  });

  const { sentinelRef, setObserver } = useIntersectionObserver(() => {
    
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

   const { data: status, isLoading:isRefreshLoading, isError:isRefreshError } = useAuth();

 if (isError) {
  if (axios.isAxiosError(error)) {
    // Cas 401 : token expiré → tenter le refresh
    if (error.response?.status === 401) {
      if (isRefreshLoading) {
        // On est en train de tenter un refresh
        return <Loader />;
      }

      if (status === "success") {
        // Refresh OK → on attend que useInfiniteQuery refetch automatiquement
        return <Loader />;
      }

      if (status === "unauthorized" || isRefreshError) {
        // Refresh KO → rediriger vers /auth
        return <Navigate to="/auth" />;
      }

      // Autres cas (sécurité)
      return <Error />;
    }
  }

  // Autres types d'erreurs
  return <Error />;
}
  const notes = data?.pages.flatMap((page) => page.notes) ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        mode={mainMode}
        setMode={setMainMode}
      />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {mainMode === "view" && (
          isLoading && !data ? <Loader/>:<>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Sermon Notes</h1>
            </div>
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <NewNoteCard />
                {notes.map((note) => (
                  <Link
                    to={`/notes/${note.id}`}
                    key={note.id}
                    className="block h-full transition-opacity hover:opacity-95"
                  >
                    <NoteCard
                      id={note.id.toString()}
                      topic={note.topic}
                      preacher={note.preacher}
                      date={new Date(note.date)}
                      refetch={() => refetch()}
                      content={note.contentText}
                      references={note.biblicalReferences}
                      youtubeUrl={note.youtubeUrl}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <NewNoteCard />
              </div>
            )}
          </>
        )}

        {mainMode === "search" && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Résultats de recherche
              </h2>
            </div>

            {debouncedSearchTerm.trim() === "" ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="mb-4 text-gray-400">
  <svg
    className="w-16 h-16 animate-pulse"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
    />
  </svg>
</div>

                <p>Entrez un mot-clé pour commencer la recherche</p>
              </div>
            ) : notes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {notes.map((note) => (
                  <Link
                    to={`/notes/${note.id}`}
                    key={note.id}
                    className="block h-full transition-opacity hover:opacity-95"
                  >
                    <NoteCard
                      id={note.id.toString()}
                      topic={note.topic}
                      preacher={note.preacher}
                      date={new Date(note.date)}
                      refetch={() => refetch()}
                      content={note.contentText}
                      references={note.biblicalReferences}
                      youtubeUrl={note.youtubeUrl}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-16 text-gray-500">Aucun résultat trouvé</p>
            )}
          </>
        )}
      </div>

      {/* Sentinel pour scroll infini */}
      <div
        ref={(node) => {
          sentinelRef.current = node;
          setObserver(node);
        }}
        className="h-4"
      />

      {/* Loader de scroll infini */}
      {isFetchingNextPage && (
        <div className="py-4 text-center text-gray-500">Chargement...</div>
      )}

      {/* Fin de la liste */}
      {!hasNextPage && notes.length > 0 && (
        <div className="py-4 text-center text-gray-400 italic">End</div>
      )}
    </div>
  );
}
