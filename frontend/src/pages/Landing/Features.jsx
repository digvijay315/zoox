import React from 'react';
import { Link } from "react-router-dom";
import {
  BedDouble,
  UtensilsCrossed,
  PartyPopper,
  Wifi,
  Car,
  Dumbbell,
  ConciergeBell,
  ShieldCheck,
} from "lucide-react";

const rooms = [
  {
    name: "Deluxe Room",
    size: "280 sq ft",
    copy: "King or twin beds, work desk, smart TV and a walk-in shower. Ideal for short business stays.",
  },
  {
    name: "Premium Room",
    size: "340 sq ft",
    copy: "Treeline-facing windows, lounge chair, mini bar and upgraded bath amenities.",
  },
  {
    name: "Zoox Suite",
    size: "520 sq ft",
    copy: "A separate living room, dining nook for four and a bathtub — our choice for families and long stays.",
  },
];

const amenities = [
  { icon: Wifi, label: "High-speed Wi-Fi", copy: "Free across rooms and public areas." },
  { icon: Car, label: "Valet parking", copy: "Covered portico drop-off and secure parking." },
  { icon: Dumbbell, label: "Fitness room", copy: "Cardio and free weights, open 6am–10pm." },
  { icon: ConciergeBell, label: "24/7 front desk", copy: "Late check-in, laundry and travel desk." },
  { icon: UtensilsCrossed, label: "In-room dining", copy: "Round-the-clock menu, including light bites." },
  { icon: ShieldCheck, label: "Safety first", copy: "CCTV, fire systems and trained night staff." },
];

const pillars = [
  {
    icon: BedDouble,
    image: "/suite.jpg",
    eyebrow: "Stay",
    title: "Rooms designed for real rest",
    copy: "Blackout drapes, silent split ACs, bedside charging and housekeeping twice a day. Every room is serviced with fresh linen and a personal welcome tray.",
  },
  {
    icon: UtensilsCrossed,
    image: "/dining.jpg",
    eyebrow: "Dine",
    title: "The Portico Kitchen & Bar",
    copy: "Breakfast from 7am, a regional thali at noon and a candlelit à la carte menu after seven. Private dining for eight is available on request.",
  },
  {
    icon: PartyPopper,
    image: "/banquet.jpg",
    eyebrow: "Celebrate",
    title: "Banquets, lawns and conferences",
    copy: "A pillarless hall for up to 400 guests, a garden lawn for receptions, and a boardroom for twenty with projection and refreshments.",
  },
];

function Features() {
  return (
    <div className="min-h-screen bg-background">
      <section className="surface-ink px-6 pb-20 pt-40 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Features</p>
          <h1 className="rule-gold mt-5 max-w-2xl font-display text-5xl leading-tight lg:text-6xl">
            Every comfort, quietly in place
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-ink-foreground/70">
            From the first cup of tea to the last light switched off, here is
            what a stay at Zoox includes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-24 px-6 py-24 lg:px-10">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className={`grid items-center gap-12 lg:grid-cols-2 ${
              i % 2 ? "lg:[&>figure]:order-2" : ""
            }`}
          >
            <figure className="overflow-hidden shadow-luxe">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                width={1280}
                height={960}
                className="h-[26rem] w-full object-cover"
              />
            </figure>
            <div>
              <p.icon className="text-gold" size={26} />
              <p className="eyebrow mt-5">{p.eyebrow}</p>
              <h2 className="mt-3 font-display text-4xl leading-tight">
                {p.title}
              </h2>
              <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">
                {p.copy}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow">Accommodation</p>
          <h2 className="mt-4 font-display text-4xl">Room categories</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {rooms.map((r) => (
              <div key={r.name} className="border border-border bg-card p-8">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {r.size}
                </p>
                <h3 className="mt-3 font-display text-2xl">{r.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {r.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <p className="eyebrow">Amenities</p>
        <h2 className="mt-4 font-display text-4xl">Included with every stay</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a) => (
            <div key={a.label} className="flex gap-4">
              <a.icon className="mt-1 shrink-0 text-gold" size={22} />
              <div>
                <h3 className="font-display text-xl">{a.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.copy}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-border pt-10">
          <Link
            to="/contact"
            className="inline-block bg-primary px-9 py-3.5 text-[0.7rem] uppercase tracking-[0.22em] text-primary-foreground"
          >
            Check availability
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Features;
