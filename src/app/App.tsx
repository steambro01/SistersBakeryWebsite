import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BUSINESS_NAME = "Sweet by Sophie";
const SPECIALTY_FORM_URL = "https://forms.google.com";

const featuredItems = [
  {
    id: 1,
    name: "Chocolate Chip Cookies",
    tag: "Customer Favorite",
    img: "https://images.unsplash.com/photo-1557310717-d6bea9f36682?w=1400&h=700&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Classic Birthday Cake",
    tag: "Made to Order",
    img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1400&h=700&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "Cinnamon Rolls",
    tag: "Fresh Daily",
    img: "https://images.unsplash.com/photo-1694632288834-17d86b340745?w=1400&h=700&fit=crop&auto=format",
  },
  {
    id: 4,
    name: "French Macarons",
    tag: "Seasonal Flavors",
    img: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=1400&h=700&fit=crop&auto=format",
  },
  {
    id: 5,
    name: "Fudge Brownies",
    tag: "Crowd Pleaser",
    img: "https://images.unsplash.com/photo-1636743715220-d8f8dd900b87?w=1400&h=700&fit=crop&auto=format",
  },
];

const allItems = [
  {
    id: 1,
    name: "Chocolate Chip Cookies",
    price: "$3.50 each",
    img: "https://images.unsplash.com/photo-1557310717-d6bea9f36682?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Classic Birthday Cake",
    price: "$48.00",
    img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "Cinnamon Rolls",
    price: "$18.00 / half-dozen",
    img: "https://images.unsplash.com/photo-1694632288834-17d86b340745?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: 4,
    name: "French Macarons",
    price: "$14.00 / 6-pack",
    img: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: 5,
    name: "Fudge Brownies",
    price: "$22.00 / dozen",
    img: "https://images.unsplash.com/photo-1636743715220-d8f8dd900b87?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: 6,
    name: "Vanilla Cupcakes",
    price: "$28.00 / dozen",
    img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: 7,
    name: "Decorated Sugar Cookies",
    price: "$24.00 / dozen",
    img: "https://images.unsplash.com/photo-1734180206659-ad037b2024fe?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: 8,
    name: "Strawberry Cheesecake",
    price: "$42.00",
    img: "https://images.unsplash.com/photo-1676300185983-d5f242babe34?w=600&h=600&fit=crop&auto=format",
  },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % featuredItems.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + featuredItems.length) % featuredItems.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [isPaused, next]);

  const scrollToMenu = () => {
    document.getElementById("all-items")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-semibold tracking-tight text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {BUSINESS_NAME}
          </h1>
          <nav className="flex items-center gap-8">
            <button
              onClick={scrollToMenu}
              className="text-sm font-medium tracking-wide text-foreground hover:text-accent transition-colors duration-200 uppercase"
              style={{ letterSpacing: "0.08em" }}
            >
              All Items
            </button>
            <a
              href={SPECIALTY_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium tracking-wide px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-accent transition-colors duration-200 uppercase"
              style={{ letterSpacing: "0.08em" }}
            >
              Order a Specialty Cake
            </a>
          </nav>
        </div>
      </header>

      {/* ── Carousel ── */}
      <section
        className="relative overflow-hidden bg-muted"
        style={{ height: "520px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {featuredItems.map((item, i) => (
          <div
            key={item.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {/* slide text */}
            <div className="absolute bottom-12 left-0 right-0 px-10 md:px-20 z-10">
              <span
                className="inline-block mb-3 px-4 py-1 text-xs font-medium tracking-widest uppercase text-white/90 border border-white/40 rounded-full backdrop-blur-sm"
              >
                {item.tag}
              </span>
              <h2
                className="text-4xl md:text-5xl font-semibold text-white leading-tight"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
              >
                {item.name}
              </h2>
            </div>
          </div>
        ))}

        {/* arrows */}
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-colors duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-colors duration-200"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {featuredItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                background: i === current ? "#C4633A" : "rgba(255,255,255,0.5)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── All Items ── */}
      <section id="all-items" className="max-w-7xl mx-auto px-6 py-16">
        {/* section heading */}
        <div className="mb-10 flex items-end gap-6">
          <h2
            className="text-3xl md:text-4xl font-semibold text-primary leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Everything We Bake
          </h2>
          <div className="flex-1 h-px bg-border mb-2 hidden sm:block" />
        </div>

        {/* grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {allItems.map((item) => (
            <div key={item.id} className="group flex flex-col">
              {/* image */}
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted mb-3">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* info */}
              <p
                className="text-base font-semibold text-primary leading-snug mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.name}
              </p>
              <p className="text-sm text-muted-foreground font-light">
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-secondary mt-4">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span
            className="text-lg font-semibold text-primary"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {BUSINESS_NAME}
          </span>
          <p className="text-xs text-muted-foreground tracking-wide">
            Baked with love · Orders by request
          </p>
        </div>
      </footer>
    </div>
  );
}
