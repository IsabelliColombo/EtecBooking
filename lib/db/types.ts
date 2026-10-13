import type { Book } from "@/lib/mock-books";

export interface BookDocument extends Book {
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
}
