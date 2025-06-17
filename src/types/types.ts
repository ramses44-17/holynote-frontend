import { JSONContent } from "@tiptap/react";

export type Note = {
  id: string;
  topic: string;
  contentText?: string;
  contentJSON?: JSONContent;
  contentHTML?: string;
  biblicalReferences: string[];
  youtubeUrl?: string;
  preacher: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type NotesResponse = {
  notes: Note[];
  total: number;
  currentPage: number;
  totalPages: number;
};


export type AuthResponse = {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

export type NoteMutation = {
    content?: string | null;
    contentHTML?: string | null;
    contentJSON?: JSONContent | null;
    youtubeUrl?: string | null;
    references?: string | null;
    topic: string;
    preacher: string;
    date: string;
  }
