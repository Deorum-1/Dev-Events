import "server-only";

import mongoose, {
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose";

export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<Event>;

type EventModel = Model<Event>;
type EventTextField = keyof Pick<
  Event,
  | "title"
  | "description"
  | "overview"
  | "image"
  | "venue"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "audience"
  | "organizer"
>;

const requiredTextFields: readonly EventTextField[] = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
];

const requiredString = {
  type: String,
  required: true,
  trim: true,
  minlength: 1,
} as const;

function hasContent(value: string): boolean {
  return value.trim().length > 0;
}

function hasNonEmptyStrings(values: readonly string[] | null | undefined): boolean {
  return Array.isArray(values) && values.length > 0 && values.every(hasContent);
}

function createSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDate(value: string): string {
  const dateInput = value.trim();
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput);

  if (dateOnlyMatch) {
    const [, yearValue, monthValue, dayValue] = dateOnlyMatch;
    const year = Number(yearValue);
    const month = Number(monthValue);
    const day = Number(dayValue);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error("Event date must be a valid ISO date.");
    }

    return date.toISOString().slice(0, 10);
  }

  const parsedDate = new Date(dateInput);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Event date must be a valid date.");
  }

  // Store event dates as ISO date-only strings for predictable querying.
  return parsedDate.toISOString().slice(0, 10);
}

function normalizeTime(value: string): string {
  const timeInput = value.trim().replace(/\s+/g, " ");
  const timeMatch =
    /^(\d{1,2}):([0-5]\d)(?:\s*(?:-|to)\s*(\d{1,2}):([0-5]\d))?(?:\s*([A-Za-z]{2,5}))?$/.exec(
      timeInput,
    );

  if (!timeMatch) {
    throw new Error("Event time must use HH:mm or HH:mm - HH:mm TZ format.");
  }

  const [, startHourValue, startMinute, endHourValue, endMinute, timezone] =
    timeMatch;
  const startHour = Number(startHourValue);
  const endHour = endHourValue ? Number(endHourValue) : null;

  if (startHour > 23 || (endHour !== null && endHour > 23)) {
    throw new Error("Event time hours must be between 00 and 23.");
  }

  const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute}`;
  const endTime =
    endHour !== null
      ? ` - ${endHour.toString().padStart(2, "0")}:${endMinute}`
      : "";
  const normalizedTimezone = timezone ? ` ${timezone.toUpperCase()}` : "";

  // Normalize supported inputs to one compact 24-hour time format.
  return `${startTime}${endTime}${normalizedTimezone}`;
}

function validateRequiredFields(event: EventDocument): void {
  for (const field of requiredTextFields) {
    if (!hasContent(event[field])) {
      throw new Error(`Event ${field} is required.`);
    }
  }

  if (!hasNonEmptyStrings(event.agenda)) {
    throw new Error("Event agenda must contain at least one item.");
  }

  if (!hasNonEmptyStrings(event.tags)) {
    throw new Error("Event tags must contain at least one item.");
  }
}

const eventSchema = new Schema<Event, EventModel>(
  {
    title: requiredString,
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: requiredString,
    overview: requiredString,
    image: requiredString,
    venue: requiredString,
    location: requiredString,
    date: requiredString,
    time: requiredString,
    mode: requiredString,
    audience: requiredString,
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: hasNonEmptyStrings,
        message: "Event agenda must contain at least one non-empty item.",
      },
    },
    organizer: requiredString,
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: hasNonEmptyStrings,
        message: "Event tags must contain at least one non-empty item.",
      },
    },
  },
  { timestamps: true },
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", function prepareEventForSave(this: EventDocument) {
  validateRequiredFields(this);

  // Regenerate the URL slug only when title changes, including first save.
  if (this.isModified("title")) {
    const slug = createSlug(this.title);

    if (!slug) {
      throw new Error("Event title must include letters or numbers.");
    }

    this.slug = slug;
  }

  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

const existingEventModel = mongoose.models.Event as EventModel | undefined;

export const Event =
  existingEventModel ?? mongoose.model<Event, EventModel>("Event", eventSchema);

export default Event;
