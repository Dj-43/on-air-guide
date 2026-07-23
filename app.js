import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Signal,
  Volume2,
  VolumeX,
  Search,
  LogOut,
  Settings,
  ArrowLeft,
  CreditCard,
  Bell,
  Check,
  Calendar,
  Grid3x3,
} from "lucide-react";
import Hls from "hls.js";

const CHANNELS = [
  { num: "101", name: "News One", genre: "News", program: "Morning Report", next: "World Update — 9:00", stream: "https://t.freetv.fun/m3u/kids.m3u" },
  { num: "204", name: "Sportline", genre: "Sports", program: "Match Center", next: "Highlights — 8:30", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { num: "312", name: "CineMax Plus", genre: "Movies", program: "The Long Drive (2019)", next: "Late Feature — 10:15", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { num: "418", name: "Kidz Zone", genre: "Kids", program: "Story Friends", next: "Sing & Learn — 8:15", stream: "https://t.freetv.fun/m3u/kids.m3u" },
  { num: "509", name: "Discover", genre: "Docs", program: "Deep Ocean", next: "Wild Skies — 9:30", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { num: "622", name: "Music Live", genre: "Music", program: "Top 40 Countdown", next: "Request Hour — 8:45", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { num: "701", name: "Cook House", genre: "Lifestyle", program: "Weeknight Dinners", next: "Baking Hour — 9:00", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { num: "815", name: "Retro Vault", genre: "Classics", program: "Reruns: Season 3", next: "Movie Night — 8:30", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
];

const PLANS = [
  { id: "basic", name: "Basic", channels: 40, price: "$4.99/mo" },
  { id: "standard", name: "Standard", channels: 90, price: "$9.99/mo" },
  { id: "premium", name: "Premium", channels: 150, price: "$14.99/mo" },
];

const TIME_SLOTS = ["7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00"];

const SCHEDULE = {
  "101": ["Morning Report", "Morning Report", "World Update", "World Update", "Business Hour", "Business Hour", "Midday Brief"],
  "204": ["Match Center", "Match Center", "Highlights", "Highlights", "Press Room", "Fantasy Talk", "Fantasy Talk"],
  "312": ["Weekend Preview", "The Long Drive", "The Long Drive", "The Long Drive", "The Long Drive", "Late Feature", "Late Feature"],
  "418": ["Story Friends", "Story Friends", "Sing & Learn", "Sing & Learn", "Puzzle Pals", "Puzzle Pals", "Nap Time Tunes"],
  "509": ["Deep Ocean", "Deep Ocean", "Wild Skies", "Wild Skies", "Ancient Trails", "Ancient Trails", "Space Watch"],
  "622": ["Top 40 Countdown", "Top 40 Countdown", "Request Hour", "Request Hour", "Throwback Mix", "Throwback Mix", "Indie Hour"],
  "701": ["Weeknight Dinners", "Weeknight Dinners", "Baking Hour", "Baking Hour", "Street Food", "Street Food", "Chef's Table"],
  "815": ["Reruns: Season 3", "Reruns: Season 3", "Movie Night", "Movie Night", "Movie Night", "Classic Hour", "Classic Hour"],
};

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticated(form.email || "viewer@example.com");
  };

  return (
    <div className="min-h-screen bg-[#0F2124] text-[#F0E6D2] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8503A] tally" />
          <span className="tuner-font text-sm tracking-[0.25em] uppercase text-[#F0E6D2]/60 font-semibold">
            On Air Guide
          </span>
        </div>

        <div className="bg-[#122A2E] border border-[#1E3A3F] rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex bg-[#0F2124] rounded-xl p-1 mb-7">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 tuner-font text-sm font-semibold uppercase tracking-wide py-2.5 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] ${
                mode === "signin" ? "bg-[#1E3A3F] text-[#F0E6D2]" : "text-[#F0E6D2]/40"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 tuner-font text-sm font-semibold uppercase tracking-wide py-2.5 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] ${
                mode === "signup" ? "bg-[#1E3A3F] text-[#F0E6D2]" : "text-[#F0E6D2]/40"
              }`}
            >
              Create Account
            </button>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-1">
            {mode === "signin" ? "Welcome back" : "Set up your account"}
          </h1>
          <p className="text-sm text-[#F0E6D2]/45 mb-6">
            {mode === "signin"
              ? "Sign in to keep watching where you left off."
              : "A few details and you're ready to watch."}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
                  Name
                </span>
                <div className="relative mt-1.5">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0E6D2]/35" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Your name"
                    className="w-full bg-[#0F2124] border border-[#1E3A3F] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
                Email
              </span>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0E6D2]/35" />
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full bg-[#0F2124] border border-[#1E3A3F] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
                Password
              </span>
              <div className="relative mt-1.5">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0E6D2]/35" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  className="w-full bg-[#0F2124] border border-[#1E3A3F] rounded-lg pl-9 pr-9 py-2.5 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F0E6D2]/35 hover:text-[#F0E6D2]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] rounded"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {mode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-[#F0E6D2]/45 hover:text-[#F0E6D2]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] rounded"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#E8503A] hover:bg-[#d7452f] transition-colors tuner-font text-sm font-semibold uppercase tracking-wide py-3 rounded-lg text-[#0F2124] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A9C94]"
            >
              <Signal size={15} />
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-[#F0E6D2]/35 mt-6">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-[#F0E6D2]/70 hover:text-[#F0E6D2] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] rounded"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-[#F0E6D2]/70 hover:text-[#F0E6D2] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] rounded"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function VideoPlayer({ src, muted }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted={muted}
      playsInline
      controls={false}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}function ChannelGrid({ userEmail, onSignOut, onOpenSettings, onOpenGuide }) {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [query, setQuery] = useState("");
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const filtered = CHANNELS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.num.includes(query) ||
      c.genre.toLowerCase().includes(query.toLowerCase())
  );

  const ch = CHANNELS[active];
  const timeStr = clock.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-[#0F2124] text-[#F0E6D2] flex flex-col md:flex-row">
      <aside className="w-full md:w-80 md:h-screen md:sticky md:top-0 flex flex-col border-b md:border-b-0 md:border-r border-[#1E3A3F]">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8503A] tally" />
              <span className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/60 font-semibold">
                On Air Guide
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenGuide}
                aria-label="Full program guide"
                className="text-[#F0E6D2]/40 hover:text-[#F0E6D2]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] rounded"
              >
                <Grid3x3 size={15} />
              </button>
              <button
                onClick={onOpenSettings}
                aria-label="Account settings"
                className="text-[#F0E6D2]/40 hover:text-[#F0E6D2]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] rounded"
              >
                <Settings size={15} />
              </button>
              <button
                onClick={onSignOut}
                aria-label="Sign out"
                title={`Signed in as ${userEmail}`}
                className="text-[#F0E6D2]/40 hover:text-[#F0E6D2]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] rounded"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0E6D2]/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channels or genres"
              className="w-full bg-[#122A2E] border border-[#1E3A3F] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-6 md:max-h-[calc(100vh-100px)]">
          {filtered.length === 0 && (
            <p className="text-sm text-[#F0E6D2]/40 px-2 py-4">No channels match "{query}".</p>
          )}
          <ul className="space-y-1">
            {filtered.map((c) => {
              const i = CHANNELS.indexOf(c);
              const isActive = i === active;
              return (
                <li key={c.num}>
                  <button
                    onClick={() => setActive(i)}
                    aria-current={isActive}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] ${
                      isActive ? "bg-[#1E3A3F]" : "hover:bg-[#122A2E]"
                    }`}
                  >
                    <span className={`tuner-font text-base font-semibold w-10 shrink-0 ${isActive ? "text-[#E8503A]" : "text-[#F0E6D2]/50"}`}>
                      {c.num}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold truncate">{c.name}</span>
                      <span className="block text-xs text-[#F0E6D2]/45 truncate">{c.program}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-[#F0E6D2]/35 shrink-0">{c.genre}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4">
          <span className="tuner-font text-sm tracking-[0.15em] uppercase text-[#F0E6D2]/50">Live Now</span>
          <span className="tuner-font text-sm text-[#F0E6D2]/50">{timeStr}</span>
        </header>

        <div className="px-4 md:px-8">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            <VideoPlayer src={ch.stream} muted={muted} />

            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#E8503A] tally" />
              <span className="text-[11px] font-bold tracking-wide uppercase">Live</span>
              <Signal size={12} className="text-[#F0E6D2]/60 ml-1" />
            </div>

            <button
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94]"
            >
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </div>
        </div>

        <div className="px-4 md:px-8 mt-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="tuner-font text-lg md:text-2xl font-semibold text-[#E8503A]">{ch.num}</span>
            <h1 className="text-xl md:text-2xl font-bold">{ch.name}</h1>
            <span className="text-xs uppercase tracking-wide text-[#F0E6D2]/40 border border-[#1E3A3F] rounded-full px-2.5 py-1">{ch.genre}</span>
          </div>
          <p className="mt-2 text-[#F0E6D2]/70">{ch.program}</p>
          <p className="mt-1 text-sm text-[#F0E6D2]/40">Up next: {ch.next}</p>
        </div>

        <div className="mt-8 mb-8 px-4 md:px-8">
          <p className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/40 mb-3">More Channels</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {CHANNELS.map((c, i) => (
              <button
                key={c.num}
                onClick={() => setActive(i)}
                className={`shrink-0 w-36 rounded-xl border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] ${
                  i === active ? "border-[#E8503A] bg-[#1E3A3F]" : "border-[#1E3A3F] hover:bg-[#122A2E]"
                }`}
              >
                <span className="tuner-font text-sm font-semibold text-[#F0E6D2]/60">{c.num}</span>
                <p className="text-sm font-semibold truncate mt-1">{c.name}</p>
                <p className="text-xs text-[#F0E6D2]/40 truncate">{c.program}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function AccountSettings({ userEmail, onBack, onSignOut, plan, onChangePlan, onGoToPayment }) {
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F2124] text-[#F0E6D2]">
      <header className="flex items-center gap-3 px-4 md:px-8 py-5 border-b border-[#1E3A3F]">
        <button
          onClick={onBack}
          aria-label="Back to channel guide"
          className="w-9 h-9 rounded-full bg-[#122A2E] flex items-center justify-center hover:bg-[#1E3A3F] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94]"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8503A] tally" />
          <span className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/60 font-semibold">
            Account Settings
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <section className="mb-10">
          <h2 className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/40 mb-4">
            Profile
          </h2>
          <div className="bg-[#122A2E] border border-[#1E3A3F] rounded-2xl p-5 md:p-6 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
                Name
              </span>
              <div className="relative mt-1.5">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0E6D2]/35" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Add your name"
                  className="w-full bg-[#0F2124] border border-[#1E3A3F] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
                Email
              </span>
              <div className="relative mt-1.5">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0E6D2]/35" />
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full bg-[#0F2124]/60 border border-[#1E3A3F] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F0E6D2]/60 cursor-not-allowed"
                />
              </div>
            </label>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/40 mb-4">
            Plan
          </h2>
          <div className="space-y-2.5">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => onChangePlan(p.id)}
                className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94] ${
                  plan === p.id
                    ? "border-[#E8503A] bg-[#1E3A3F]"
                    : "border-[#1E3A3F] bg-[#122A2E] hover:bg-[#16302F]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      plan === p.id ? "border-[#E8503A] bg-[#E8503A]" : "border-[#F0E6D2]/30"
                    }`}
                  >
                    {plan === p.id && <Check size={12} color="#0F2124" strokeWidth={3} />}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{p.name}</p>
                    <p className="text-xs text-[#F0E6D2]/45">{p.channels} channels</p>
                  </div>
                </div>
                <span className="tuner-font text-sm font-semibold text-[#F0E6D2]/70">
                  {p.price}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/40 mb-4">
            Preferences
          </h2>
          <div className="bg-[#122A2E] border border-[#1E3A3F] rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-[#F0E6D2]/50" />
                <div>
                  <p className="text-sm font-semibold">Programme reminders</p>
                  <p className="text-xs text-[#F0E6D2]/40">Get notified before your shows start</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications((n) => !n)}
                role="switch"
                aria-checked={notifications}
                aria-label="Toggle programme reminders"
                className={`w-11 h-6 rounded-full relative transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A9C94] ${
                  notifications ? "bg-[#E8503A]" : "bg-[#1E3A3F]"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#F0E6D2] transition-all ${
                    notifications ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToPayment}
            className="flex-1 flex items-center justify-center gap-2 bg-[#E8503A] hover:bg-[#d7452f] transition-colors tuner-font text-sm font-semibold uppercase tracking-wide py-3 rounded-lg text-[#0F2124] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A9C94]"
          >
            <CreditCard size={15} />
            Update Payment
          </button>
          <button
            onClick={onSignOut}
            className="flex items-center justify-center gap-2 border border-[#1E3A3F] hover:bg-[#122A2E] transition-colors tuner-font text-sm font-semibold uppercase tracking-wide py-3 px-5 rounded-lg text-[#F0E6D2]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94]"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}function PaymentScreen({ plan, onBack, onPaid }) {
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [processing, setProcessing] = useState(false);
  const selectedPlan = PLANS.find((p) => p.id === plan) || PLANS[1];

  const update = (field) => (e) => setCard((c) => ({ ...c, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaid();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0F2124] text-[#F0E6D2]">
      <header className="flex items-center gap-3 px-4 md:px-8 py-5 border-b border-[#1E3A3F]">
        <button
          onClick={onBack}
          aria-label="Back to account settings"
          className="w-9 h-9 rounded-full bg-[#122A2E] flex items-center justify-center hover:bg-[#1E3A3F] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94]"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8503A] tally" />
          <span className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/60 font-semibold">
            Payment
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 md:px-8 py-8">
        <div className="bg-[#122A2E] border border-[#1E3A3F] rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{selectedPlan.name} Plan</p>
              <p className="text-xs text-[#F0E6D2]/45">{selectedPlan.channels} channels</p>
            </div>
            <span className="tuner-font text-lg font-semibold text-[#E8503A]">
              {selectedPlan.price}
            </span>
          </div>
        </div>

        <h2 className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/40 mb-4">
          Card Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
              Name on card
            </span>
            <input
              type="text"
              value={card.name}
              onChange={update("name")}
              placeholder="Full name"
              required
              className="w-full mt-1.5 bg-[#122A2E] border border-[#1E3A3F] rounded-lg px-3 py-2.5 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
              Card number
            </span>
            <div className="relative mt-1.5">
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F0E6D2]/35" />
              <input
                type="text"
                inputMode="numeric"
                value={card.number}
                onChange={update("number")}
                placeholder="1234 5678 9012 3456"
                required
                className="w-full bg-[#122A2E] border border-[#1E3A3F] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
              />
            </div>
          </label>

          <div className="flex gap-3">
            <label className="block flex-1">
              <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
                Expiry
              </span>
              <input
                type="text"
                value={card.expiry}
                onChange={update("expiry")}
                placeholder="MM/YY"
                required
                className="w-full mt-1.5 bg-[#122A2E] border border-[#1E3A3F] rounded-lg px-3 py-2.5 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
              />
            </label>
            <label className="block flex-1">
              <span className="text-xs font-bold uppercase tracking-wide text-[#F0E6D2]/50">
                CVC
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={card.cvc}
                onChange={update("cvc")}
                placeholder="123"
                required
                className="w-full mt-1.5 bg-[#122A2E] border border-[#1E3A3F] rounded-lg px-3 py-2.5 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A9C94]"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full flex items-center justify-center gap-2 bg-[#E8503A] hover:bg-[#d7452f] disabled:opacity-60 transition-colors tuner-font text-sm font-semibold uppercase tracking-wide py-3 rounded-lg text-[#0F2124] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A9C94] mt-2"
          >
            <Signal size={15} />
            {processing ? "Processing..." : `Pay ${selectedPlan.price}`}
          </button>

          <p className="text-center text-xs text-[#F0E6D2]/35 mt-2">
            This is a placeholder form — no real payment is being processed yet.
          </p>
        </form>
      </main>
    </div>
  );
}

function ProgramGuide({ onBack, onSelectChannel }) {
  return (
    <div className="min-h-screen bg-[#0F2124] text-[#F0E6D2]">
      <header className="flex items-center gap-3 px-4 md:px-8 py-5 border-b border-[#1E3A3F]">
        <button
          onClick={onBack}
          aria-label="Back to channel guide"
          className="w-9 h-9 rounded-full bg-[#122A2E] flex items-center justify-center hover:bg-[#1E3A3F] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94]"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#F0E6D2]/50" />
          <span className="tuner-font text-xs tracking-[0.2em] uppercase text-[#F0E6D2]/60 font-semibold">
            Full Schedule — Today
          </span>
        </div>
      </header>

      <main className="overflow-x-auto px-4 md:px-8 py-6">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[140px_repeat(7,1fr)] gap-1 mb-2">
            <div />
            {TIME_SLOTS.map((t) => (
              <div key={t} className="tuner-font text-xs text-[#F0E6D2]/40 text-center py-1">
                {t}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {CHANNELS.map((c) => (
              <div key={c.num} className="grid grid-cols-[140px_repeat(7,1fr)] gap-1">
                <button
                  onClick={() => onSelectChannel(CHANNELS.indexOf(c))}
                  className="flex items-center gap-2 bg-[#122A2E] rounded-lg px-3 py-2.5 text-left hover:bg-[#1E3A3F] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A9C94]"
                >
                  <span className="tuner-font text-sm font-semibold text-[#E8503A]">{c.num}</span>
                  <span className="text-xs font-semibold truncate">{c.name}</span>
                </button>
                {SCHEDULE[c.num].map((show, idx) => (
                  <div
                    key={idx}
                    className="bg-[#122A2E]/60 border border-[#1E3A3F] rounded-lg px-2 py-2.5 flex items-center"
                  >
                    <span className="text-[11px] text-[#F0E6D2]/70 truncate">{show}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("guide");
  const [plan, setPlan] = useState("standard");

  const handleSignOut = () => {
    setUser(null);
    setView("guide");
  };

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
        .tuner-font { font-family: 'Oswald', sans-serif; font-variant-numeric: tabular-nums; }
        .tally { animation: pulse 1.8s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        @media (prefers-reduced-motion: reduce) { .tally { animation: none; } }
      `}</style>

      {!user ? (
        <AuthScreen onAuthenticated={(email) => setUser(email)} />
      ) : view === "settings" ? (
        <AccountSettings
          userEmail={user}
          plan={plan}
          onChangePlan={setPlan}
          onBack={() => setView("guide")}
          onSignOut={handleSignOut}
          onGoToPayment={() => setView("payment")}
        />
      ) : view === "payment" ? (
        <PaymentScreen
          plan={plan}
          onBack={() => setView("settings")}
          onPaid={() => setView("settings")}
        />
      ) : view === "schedule" ? (
        <ProgramGuide
          onBack={() => setView("guide")}
          onSelectChannel={() => setView("guide")}
        />
      ) : (
        <ChannelGrid
          userEmail={user}
          onSignOut={handleSignOut}
          onOpenSettings={() => setView("settings")}
          onOpenGuide={() => setView("schedule")}
        />
      )}
    </div>
  );
}
