import type { Book } from "@/lib/mock-books";

export interface BookDocument extends Book {
  createdAt: Date;
  updatedAt: Date;
}

export type ReservationStatus =
  | "pending"
  | "active"
  | "returned"
  | "cancelled";

export interface ReservationDocument {
  bookId: string;
  userId: string;
  userName?: string;
  status: ReservationStatus;
  reservedAt: Date;
  dueDate: Date;
  returnedAt?: Date;
}
