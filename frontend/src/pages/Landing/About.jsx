import React from 'react';
import { Link } from "react-router-dom";

const values = [
  {
    title: "Hospitality that remembers you",
    copy: "A small, long-serving team that learns your coffee order by the second morning.",
  },
  {
    title: "Rooted in Santhal Pargana",
    copy: "Local produce in the kitchen, local artisans on our walls, local families on our team.",
  },
  {
    title: "Detail over decoration",
    copy: "Fewer flourishes, better basics — clean lines, honest materials, quiet corridors.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative flex min-h-[62vh] items-end overflow-hidden">
        <img
          src="/hero.jpg"
          alt="Zoox hotel facade in Dumka"
          width={1920}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 lg:px-10">
          <p className="eyebrow">About us</p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl leading-tight text-ink-foreground lg:text-6xl">
            A hotel built for its own town
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="rule-gold mt-5 font-display text-4xl leading-tight">
              From a family enterprise to Dumka&apos;s premium address
            </h2>
          </div>
          <div className="space-y-6 text-[0.98rem] leading-relaxed text-muted-foreground">
            <p>
              Zoox was created by The Grand Portico with a simple brief: give
              Dumka a hotel that travellers from Kolkata, Ranchi and Deoghar
              would happily return to, and that local families would be proud to
              celebrate in.
            </p>
            <p>
              The property sits on the Dumka Rampurhat Road, minutes from the
              town centre and an easy drive from Basukinath and Deoghar. Behind
              the stone portico are twenty-eight rooms, an all-day kitchen, a
              banquet hall and a lawn that fills with light in the evenings.
            </p>
            <p>
              We are still writing the next chapters — new suites, a garden café
              and curated tours across Santhal Pargana are on the way.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="eyebrow">What we stand for</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className="border-t border-gold/50 pt-6">
                <p className="font-display text-3xl text-gold">
                  0{i + 1}
                </p>
                <h3 className="mt-4 font-display text-2xl leading-snug">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {v.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-ink py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="eyebrow">Visit us</p>
            <h2 className="mt-3 font-display text-3xl lg:text-4xl">
              Plot No. 316, Rampur, Dumka Rampurhat Road
            </h2>
            <p className="mt-2 text-sm text-ink-foreground/60">
              Dumka – 814119, Jharkhand
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-gold px-9 py-3.5 text-[0.7rem] uppercase tracking-[0.22em] text-ink"
          >
            Get directions
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
