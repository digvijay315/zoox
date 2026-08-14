import React from 'react';
import { Link } from 'react-router-dom';

const highlights = [
  {
    image: "/suite.jpg",
    eyebrow: "Stay",
    title: "Rooms & Suites",
    copy: "Twenty-eight rooms in warm walnut and ivory, with blackout drapes, rain showers and beds dressed in 300-thread cotton.",
  },
  {
    image: "/dining.jpg",
    eyebrow: "Dine",
    title: "The Portico Kitchen",
    copy: "An all-day restaurant serving Jharkhandi classics beside slow-cooked North Indian plates and a quiet evening bar menu.",
  },
  {
    image: "/banquet.jpg",
    eyebrow: "Celebrate",
    title: "Banquets & Lawns",
    copy: "A pillarless hall for 400 guests and an open lawn for evening receptions, with in-house décor and catering teams.",
  },
];

function Hero() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <img
          src="/hero.jpg"
          alt="Zoox hotel entrance lit at dusk in Dumka, Jharkhand"
          width={1920}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="fade-up relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">Dumka · Jharkhand</p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-ink-foreground sm:text-6xl lg:text-7xl">
            A quieter kind of luxury
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-foreground/80">
            Zoox is the flagship hospitality address of The Grand Portico —
            twenty-eight rooms, a seasonal kitchen and celebration spaces set
            just off the Dumka Rampurhat Road.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="bg-gold px-9 py-3.5 text-[0.7rem] uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-90"
            >
              Enquire & Reserve
            </Link>
            <Link
              to="/features"
              className="border border-ink-foreground/40 px-9 py-3.5 text-[0.7rem] uppercase tracking-[0.22em] text-ink-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Explore the hotel
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">The house</p>
            <h2 className="rule-gold mt-5 font-display text-4xl leading-tight lg:text-5xl">
              Considered comfort, close to everything in Dumka
            </h2>
          </div>
          <div className="space-y-6 text-[0.98rem] leading-relaxed text-muted-foreground">
            <p>
              Built for travellers who want space to breathe, Zoox pairs the ease
              of a business hotel with the warmth of a family address. Arrive to
              valet parking under the portico, unwind in rooms that face the
              treeline, and let our team handle the rest.
            </p>
            <p>
              Whether you are here for a two-night work trip, a family wedding or
              a long weekend across Santhal Pargana, every detail — from the
              filter coffee at dawn to the turned-down bed at night — is looked
              after.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["28", "Rooms & suites"],
                ["400", "Banquet capacity"],
                ["24/7", "In-room dining"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-4xl text-primary">{n}</p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((h) => (
              <article
                key={h.title}
                className="group overflow-hidden bg-card shadow-luxe"
              >
                <div className="overflow-hidden">
                  <img
                    src={h.image}
                    alt={h.title}
                    loading="lazy"
                    width={1280}
                    height={960}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <p className="eyebrow">{h.eyebrow}</p>
                  <h3 className="mt-3 font-display text-2xl">{h.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {h.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-ink py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">Reservations</p>
          <h2 className="mt-5 font-display text-4xl leading-tight lg:text-5xl">
            Planning a stay or an occasion?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-foreground/70">
            Our front desk answers every call personally. Share your dates and we
            will hold the right room, table or hall for you.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+916299382018"
              className="bg-gold px-9 py-3.5 text-[0.7rem] uppercase tracking-[0.22em] text-ink"
            >
              +91 62993 82018
            </a>
            <Link
              to="/contact"
              className="border border-ink-foreground/40 px-9 py-3.5 text-[0.7rem] uppercase tracking-[0.22em] text-ink-foreground hover:border-gold hover:text-gold"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
