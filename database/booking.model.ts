import "server-only";

import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

import { Event } from "./event.model";

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<Booking>;

type BookingModel = Model<Booking>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return emailPattern.test(email);
}

const bookingSchema = new Schema<Booking, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: isValidEmail,
        message: "Booking email must be valid.",
      },
    },
  },
  { timestamps: true },
);

// Bookings are commonly looked up by event.
bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function validateBookingForSave(
  this: BookingDocument,
) {
  this.email = normalizeEmail(this.email);

  if (!isValidEmail(this.email)) {
    throw new Error("Booking email must be valid.");
  }

  // MongoDB refs are not enforced, so guard the event relationship before writes.
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error("Booking eventId must reference an existing event.");
  }
});

const existingBookingModel = mongoose.models.Booking as BookingModel | undefined;

export const Booking =
  existingBookingModel ??
  mongoose.model<Booking, BookingModel>("Booking", bookingSchema);

export default Booking;
