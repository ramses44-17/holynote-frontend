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

  const passageSplited = passage.split(" ")

  const passageSplitedPartOne = passage.match(/^\d+\s\w+/) ? [passageSplited.slice(0,2).join(" "),passageSplited[2]] : passageSplited;
  const bookName = passageSplitedPartOne[0];
  const bookId = booksWithIds.find((book) => book.name === bookName)?.id;
  if (!bookId) return null;

  const passageSplitedPartTwo = passageSplitedPartOne[1];

  if (passageSplitedPartTwo.match(/^\d+$/)) {
    return `${bookId}.${passageSplitedPartTwo}`;
  }

  if (passageSplitedPartTwo.match(/^\d+:\d+$/)) {
    const [chapters, initialVerse] = passageSplitedPartTwo.split(":");
    return `${bookId}.${chapters}.${initialVerse}`;
  }

  if (passageSplitedPartTwo.match(/^\d+:\d+-\d+$/)) {
    const [chapters, verses] = passageSplitedPartTwo.split(":");
    const [initialVerse, finalVerse] = verses.split("-");
    return `${bookId}.${chapters}.${initialVerse}-${bookId}.${chapters}.${finalVerse}`;
  }

  return null;
};

export const BiblicreferencesRegex = /^(\d?\s?[a-zA-ZÀ-ÿ]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?(,\s\d?\s?[a-zA-ZÀ-ÿ]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?)*)$/

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:3000/api"
