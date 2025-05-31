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

const fetchNotes = async ({
  pageParam = 1,
  searchTerm,
}: {
  pageParam?: number;
  searchTerm: string;
}) => {
  const response = await axios.get(`${apiBaseUrl}/notes`, {
    withCredentials: true,
    params: {
      page: pageParam,
      searchTerm,
    },
  });
  return response.data; // { notes, total, currentPage, totalPage }
};

export default function NotesPage() {
  const [mainMode, setMainMode] = useState<MainMode>("view");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      fetchNotes({ pageParam:pageParam as number, searchTerm: debouncedSearchTerm }),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPage) {
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

  if (isLoading && !data) return <Loader />; // Initial load only

  if (isError) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return <Navigate to="/auth" />;
      }
    }
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
          <>
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
                <div className="text-6xl mb-4">🔍</div>
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
        <div className="py-4 text-center text-gray-400 italic">Fin de la liste</div>
      )}
    </div>
  );
}
