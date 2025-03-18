import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { booksWithIds } from "./bible";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const youtubeUrlRegex =
  /(?:youtube\.com\/(?:.*[?&]v=|(?:watch\?v=|embed\/|v\/|shorts\/|live\/))|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export const extractYoutubeId = (url?: string | null): string | null => {
  if (!url) return null
  const match = url.match(youtubeUrlRegex)
  return match ? match[1] : null
}



export const getPassageId = (passage: string): string | null => {
  if (!passage) return null;

  const passageSplitedOne = passage.split(" ");
  const bookName = passageSplitedOne[0];
  const bookId = booksWithIds.find((book) => book.name === bookName)?.id;
  if (!bookId) return null;

  const passageSplitedTwo = passageSplitedOne[1];

  if (passageSplitedTwo.match(/^\d+$/)) {
    return `${bookId}.${passageSplitedTwo}`;
  }

  if (passageSplitedTwo.match(/^\d+:\d+$/)) {
    const [chapters, initialVerse] = passageSplitedTwo.split(":");
    return `${bookId}.${chapters}.${initialVerse}`;
  }

  if (passageSplitedTwo.match(/^\d+:\d+-\d+$/)) {
    const [chapters, verses] = passageSplitedTwo.split(":");
    const [initialVerse, finalVerse] = verses.split("-");
    return `${bookId}.${chapters}.${initialVerse}-${bookId}.${chapters}.${finalVerse}`;
  }

  return null;
};


export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:3000/api"
