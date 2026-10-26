import type { ObjectId } from "mongodb";
import type { Book } from "@/lib/mock-books";

export interface BookDocument extends Book {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  activeReservationId?: string;
}

export type ReservationStatus =
  | "pending"
  | "active"
  | "returned"
  | "cancelled";

export interface ReservationDocument {
  reservationId: string;
  bookId: string;
  catalogBookId?: string;
  bookTitle?: string;
  bookAuthor?: string;
  userId: string;
  userName?: string;
  userCourse?: string;
  status: ReservationStatus;
  reservedAt: Date;
  dueDate: Date;
  returnedAt?: Date;
  readingStatus?: "reading" | "completed";
  readingFinishedAt?: Date;
}
