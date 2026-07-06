export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "Google I/O 2027",
    image: "/images/event1.png",
    slug: "google-io-2027",
    location: "Mountain View, California, USA",
    date: "2027-05-10",
    time: "09:00 - 18:00 PST",
  },
  {
    title: "Apple WWDC 2027",
    image: "/images/event2.png",
    slug: "wwdc-2027",
    location: "Apple Park, Cupertino, California, USA",
    date: "2027-06-05",
    time: "10:00 - 19:00 PST",
  },
  {
    title: "Microsoft Build 2027",
    image: "/images/event3.png",
    slug: "microsoft-build-2027",
    location: "Seattle, Washington, USA",
    date: "2027-05-23",
    time: "08:30 - 17:30 PST",
  },
  {
    title: "AWS re:Invent 2026",
    image: "/images/event4.png",
    slug: "aws-reinvent-2026",
    location: "Las Vegas, Nevada, USA",
    date: "2026-11-28",
    time: "08:00 - 20:00 PST",
  },
  {
    title: "Def Con 30",
    image: "/images/event5.png",
    slug: "defcon-30",
    location: "Las Vegas, Nevada, USA",
    date: "2026-08-07",
    time: "10:00 - 22:00 PST",
  },
  {
    title: "PyCon US 2027",
    image: "/images/event6.png",
    slug: "pycon-us-2027",
    location: "Portland, Oregon, USA",
    date: "2027-05-11",
    time: "09:00 - 18:00 PST",
  },
  {
    title: "React Summit 2027",
    image: "/images/event-full.png",
    slug: "react-summit-2027",
    location: "Amsterdam, Netherlands",
    date: "2027-04-14",
    time: "09:00 - 18:00 CET",
  },
  {
    title: "Global Hackathon: Build the Future",
    image: "/images/event1.png",
    slug: "global-hackathon-2026",
    location: "Online + Global Hubs",
    date: "2026-09-15",
    time: "00:00 - 23:59 UTC",
  },
  {
    title: "JavaScript Meetup Berlin",
    image: "/images/event2.png",
    slug: "js-meetup-berlin-july",
    location: "Berlin, Germany",
    date: "2026-07-15",
    time: "19:00 - 22:00 CET",
  },
  {
    title: "TechCrunch Disrupt 2026",
    image: "/images/event3.png",
    slug: "techcrunch-disrupt-2026",
    location: "San Francisco, California, USA",
    date: "2026-10-18",
    time: "09:00 - 18:00 PST",
  },
  {
    title: "CSS Day 2027",
    image: "/images/event4.png",
    slug: "css-day-2027",
    location: "Amsterdam, Netherlands",
    date: "2027-06-08",
    time: "09:30 - 17:30 CET",
  },
  {
    title: "DevOps Days Singapore",
    image: "/images/event5.png",
    slug: "devops-days-singapore",
    location: "Singapore",
    date: "2026-08-25",
    time: "09:00 - 18:00 SGT",
  },
];
