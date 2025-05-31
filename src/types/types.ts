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
  totalPage: number;
};
