import { useState, useRef } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Tv2,
  BookmarkCheck,
  Settings,
  Search,
  Bell,
  ChevronRight,
  Users,
  Video,
  Eye,
  ThumbsUp,
  Calendar,
  TrendingUp,
  Flame,
  Sparkles,
  X,
  Play,
  ExternalLink,
  Filter,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Channel {
  id: string;
  name: string;
  handle: string;
  subscribers: string;
  videoCount: number;
  totalViews: string;
  description: string;
  avatar: string;
  banner: string;
  category: string;
}

interface VideoItem {
  id: string;
  channelId: string;
  channelName: string;
  title: string;
  thumbnail: string;
  views: string;
  likes: string;
  duration: string;
  uploadDate: string;
  status: "new" | "trending" | "updated";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_CHANNELS: Channel[] = [
  {
    id: "ch1",
    name: "Fireship",
    handle: "@Fireship",
    subscribers: "2.8M",
    videoCount: 612,
    totalViews: "245M",
    description: "High-intensity code tutorials and developer content.",
    avatar: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&h=80&fit=crop&auto=format",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=200&fit=crop&auto=format",
    category: "Tech",
  },
  {
    id: "ch2",
    name: "Theo - t3.gg",
    handle: "@t3dotgg",
    subscribers: "612K",
    videoCount: 874,
    totalViews: "48M",
    description: "Full-stack web dev, TypeScript, and React ecosystem deep dives.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=200&fit=crop&auto=format",
    category: "Tech",
  },
  {
    id: "ch3",
    name: "Traversy Media",
    handle: "@TraversyMedia",
    subscribers: "2.15M",
    videoCount: 1042,
    totalViews: "192M",
    description: "Practical modern web development tutorials for all skill levels.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
    banner: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=200&fit=crop&auto=format",
    category: "Education",
  },
  {
    id: "ch4",
    name: "Lex Fridman",
    handle: "@lexfridman",
    subscribers: "4.1M",
    videoCount: 394,
    totalViews: "620M",
    description: "Long-form conversations with scientists, engineers, and visionaries.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
    banner: "https://images.unsplash.com/photo-1478737270197-f03bebb9b2ca?w=900&h=200&fit=crop&auto=format",
    category: "Podcast",
  },
  {
    id: "ch5",
    name: "Kevin Powell",
    handle: "@KevinPowell",
    subscribers: "1.07M",
    videoCount: 698,
    totalViews: "76M",
    description: "Mastering CSS — the most satisfying videos on the platform.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&auto=format",
    banner: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=900&h=200&fit=crop&auto=format",
    category: "Tech",
  },
  {
    id: "ch6",
    name: "Ali Abdaal",
    handle: "@aliabdaal",
    subscribers: "5.4M",
    videoCount: 533,
    totalViews: "390M",
    description: "Productivity, studying, medicine, and building an online business.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&auto=format",
    banner: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=900&h=200&fit=crop&auto=format",
    category: "Productivity",
  },
];

const MOCK_VIDEOS: VideoItem[] = [
  { id: "v1", channelId: "ch1", channelName: "Fireship", title: "React 19 in 100 Seconds", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop&auto=format", views: "1.2M", likes: "48K", duration: "1:43", uploadDate: "2024-12-10", status: "trending" },
  { id: "v2", channelId: "ch1", channelName: "Fireship", title: "I built an app with zero UI libraries", thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=320&h=180&fit=crop&auto=format", views: "884K", likes: "31K", duration: "8:22", uploadDate: "2024-11-28", status: "new" },
  { id: "v3", channelId: "ch2", channelName: "Theo - t3.gg", title: "TypeScript 5.7 Is Actually Huge", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&h=180&fit=crop&auto=format", views: "412K", likes: "22K", duration: "24:07", uploadDate: "2024-12-05", status: "updated" },
  { id: "v4", channelId: "ch3", channelName: "Traversy Media", title: "Next.js 15 Crash Course", thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=320&h=180&fit=crop&auto=format", views: "728K", likes: "29K", duration: "2:14:38", uploadDate: "2024-12-01", status: "new" },
  { id: "v5", channelId: "ch4", channelName: "Lex Fridman", title: "Sam Altman: OpenAI, GPT-5, and AGI", thumbnail: "https://images.unsplash.com/photo-1478737270197-f03bebb9b2ca?w=320&h=180&fit=crop&auto=format", views: "6.1M", likes: "187K", duration: "3:22:14", uploadDate: "2024-11-20", status: "trending" },
  { id: "v6", channelId: "ch5", channelName: "Kevin Powell", title: "CSS Grid is the future — here's why", thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=320&h=180&fit=crop&auto=format", views: "334K", likes: "18K", duration: "18:54", uploadDate: "2024-12-08", status: "new" },
  { id: "v7", channelId: "ch6", channelName: "Ali Abdaal", title: "My Honest Productivity System in 2025", thumbnail: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=320&h=180&fit=crop&auto=format", views: "2.8M", likes: "94K", duration: "31:02", uploadDate: "2024-12-03", status: "updated" },
  { id: "v8", channelId: "ch1", channelName: "Fireship", title: "Bun 1.2 — Node killer or meme?", thumbnail: "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=320&h=180&fit=crop&auto=format", views: "597K", likes: "26K", duration: "6:11", uploadDate: "2024-12-12", status: "trending" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VideoItem["status"] }) {
  const map = {
    new: { label: "Baru", icon: <Sparkles size={11} />, cls: "bg-blue-50 text-blue-600 border-blue-100" },
    trending: { label: "Trending", icon: <Flame size={11} />, cls: "bg-red-50 text-red-600 border-red-100" },
    updated: { label: "Update", icon: <TrendingUp size={11} />, cls: "bg-green-50 text-green-600 border-green-100" },
  };
  const { label, icon, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
      {icon}{label}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color = "text-primary" }: { icon: React.ReactNode; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className={`${color} opacity-80`}>{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function Dashboard({ channels, onSelectChannel }: { channels: Channel[]; onSelectChannel: (c: Channel) => void }) {
  const totalSubs = "9.8M";
  const totalVideos = channels.reduce((a, c) => a + c.videoCount, 0).toLocaleString();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Pantau semua channel YouTube Anda dalam satu tempat.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Tv2 size={18} />} label="Total Channel" value={String(channels.length)} sub="channel terdaftar" />
        <StatCard icon={<Video size={18} />} label="Total Video" value={totalVideos} sub="video dipantau" />
        <StatCard icon={<Users size={18} />} label="Total Subscriber" value={totalSubs} sub="gabungan semua channel" color="text-primary" />
      </div>

      {/* Channel Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Channel Terdaftar</h2>
          <span className="text-xs text-muted-foreground">{channels.length} channel</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => onSelectChannel(ch)}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={ch.avatar} alt={ch.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-border" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">{ch.name}</div>
                  <div className="text-xs text-muted-foreground">{ch.handle}</div>
                </div>
                <span className="ml-auto text-[10px] font-semibold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{ch.category}</span>
              </div>
              <div className="h-px bg-border mb-3" />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">Subscriber</div>
                  <div className="text-sm font-bold text-foreground">{ch.subscribers}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Video</div>
                  <div className="text-sm font-bold text-foreground">{ch.videoCount}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Views</div>
                  <div className="text-sm font-bold text-foreground">{ch.totalViews}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddChannel({ onAdd }: { onAdd: (ch: Channel) => void }) {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const MOCK_PREVIEW: Channel = {
    id: "ch_new_" + Date.now(),
    name: "Coding with Mosh",
    handle: "@programmingwithmosh",
    subscribers: "3.9M",
    videoCount: 311,
    totalViews: "285M",
    description: "Programming tutorials for beginners through professionals.",
    avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=80&h=80&fit=crop&auto=format",
    banner: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&h=200&fit=crop&auto=format",
    category: "Education",
  };

  function handlePreview() {
    setError("");
    setPreview(null);
    setAdded(false);
    if (!url.trim()) { setError("Masukkan URL channel YouTube."); return; }
    const valid = /youtube\.com\/(channel|c|@|user)/.test(url) || /youtu\.be/.test(url);
    if (!valid) { setError("URL tidak valid. Contoh: https://youtube.com/@channelname"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setPreview(MOCK_PREVIEW); }, 1000);
  }

  function handleAdd() {
    if (!preview) return;
    onAdd({ ...preview, id: "ch_new_" + Date.now() });
    setAdded(true);
    setTimeout(() => { setUrl(""); setPreview(null); setAdded(false); }, 2000);
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Tambah Channel</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Masukkan URL channel YouTube untuk mulai memantau.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div>
          <label className="text-sm font-semibold text-foreground block mb-2">URL Channel YouTube</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePreview()}
              placeholder="https://youtube.com/@channelname"
              className="flex-1 bg-input-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
            <button
              onClick={handlePreview}
              disabled={loading}
              className="px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-red-600 active:scale-95 transition-all disabled:opacity-60"
            >
              {loading ? "Loading…" : "Preview"}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
              <AlertCircle size={13} />{error}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground mb-1">Format URL yang didukung:</div>
          <div className="font-mono bg-secondary px-3 py-1.5 rounded text-[11px]">https://youtube.com/@channelname</div>
          <div className="font-mono bg-secondary px-3 py-1.5 rounded text-[11px]">https://youtube.com/channel/UCxxxxxxxx</div>
          <div className="font-mono bg-secondary px-3 py-1.5 rounded text-[11px]">https://youtube.com/c/channelname</div>
        </div>
      </div>

      {preview && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <img src={preview.banner} alt="banner" className="w-full h-28 object-cover bg-secondary" />
          <div className="p-5">
            <div className="flex items-center gap-3 -mt-8 mb-4">
              <img src={preview.avatar} alt={preview.name} className="w-14 h-14 rounded-full ring-4 ring-card object-cover" />
              <div className="mt-4">
                <div className="font-bold text-foreground">{preview.name}</div>
                <div className="text-xs text-muted-foreground">{preview.handle}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{preview.description}</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-secondary rounded-lg px-3 py-2 text-center">
                <div className="text-base font-bold text-foreground">{preview.subscribers}</div>
                <div className="text-[11px] text-muted-foreground">Subscriber</div>
              </div>
              <div className="bg-secondary rounded-lg px-3 py-2 text-center">
                <div className="text-base font-bold text-foreground">{preview.videoCount}</div>
                <div className="text-[11px] text-muted-foreground">Video</div>
              </div>
              <div className="bg-secondary rounded-lg px-3 py-2 text-center">
                <div className="text-base font-bold text-foreground">{preview.totalViews}</div>
                <div className="text-[11px] text-muted-foreground">Total Views</div>
              </div>
            </div>
            {added ? (
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                <CheckCircle2 size={16} /> Channel berhasil ditambahkan!
              </div>
            ) : (
              <button onClick={handleAdd} className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-red-600 transition-colors text-sm">
                Tambah Channel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AllChannels({ channels, onSelectChannel }: { channels: Channel[]; onSelectChannel: (c: Channel) => void }) {
  const [search, setSearch] = useState("");
  const filtered = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Semua Channel</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{channels.length} channel terdaftar</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari channel…"
            className="pl-8 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 w-56"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Channel</th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Kategori</th>
              <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subscriber</th>
              <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Video</th>
              <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Total Views</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ch, i) => (
              <tr key={ch.id} className={`border-b border-border last:border-0 hover:bg-secondary/40 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={ch.avatar} alt={ch.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-foreground">{ch.name}</div>
                      <div className="text-xs text-muted-foreground">{ch.handle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  <span className="text-xs font-semibold bg-secondary px-2.5 py-1 rounded-full text-muted-foreground">{ch.category}</span>
                </td>
                <td className="px-5 py-3 text-right font-semibold text-foreground">{ch.subscribers}</td>
                <td className="px-5 py-3 text-right text-muted-foreground hidden md:table-cell">{ch.videoCount}</td>
                <td className="px-5 py-3 text-right text-muted-foreground hidden md:table-cell">{ch.totalViews}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => onSelectChannel(ch)} className="text-primary hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-primary/10">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Tidak ada channel ditemukan.</div>
        )}
      </div>
    </div>
  );
}

function ChannelDetail({ channel, videos, onBack }: { channel: Channel; videos: VideoItem[]; onBack: () => void }) {
  const channelVideos = videos.filter((v) => v.channelId === channel.id);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <div className="space-y-0">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
        <ChevronRight size={14} className="rotate-180" /> Kembali
      </button>

      {/* Banner + profile */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <img src={channel.banner} alt="banner" className="w-full h-40 object-cover bg-secondary" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <img src={channel.avatar} alt={channel.name} className="w-16 h-16 rounded-full ring-4 ring-card object-cover" />
            <div className="pb-1">
              <h1 className="text-lg font-bold text-foreground">{channel.name}</h1>
              <p className="text-sm text-muted-foreground">{channel.handle}</p>
            </div>
            <a
              href={`https://youtube.com/${channel.handle}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
              <ExternalLink size={12} /> Buka di YouTube
            </a>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
          <div className="flex gap-6">
            <div><div className="text-lg font-bold text-foreground">{channel.subscribers}</div><div className="text-xs text-muted-foreground">Subscriber</div></div>
            <div><div className="text-lg font-bold text-foreground">{channel.videoCount}</div><div className="text-xs text-muted-foreground">Video</div></div>
            <div><div className="text-lg font-bold text-foreground">{channel.totalViews}</div><div className="text-xs text-muted-foreground">Total Views</div></div>
          </div>
        </div>
      </div>

      {/* Videos */}
      <h2 className="text-base font-semibold text-foreground mb-3">Video Terbaru</h2>
      {channelVideos.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground text-sm">
          Belum ada video untuk channel ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channelVideos.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVideo(v)}
              className="bg-card border border-border rounded-xl overflow-hidden text-left hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="relative">
                <img src={v.thumbnail} alt={v.title} className="w-full h-44 object-cover bg-secondary" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Play size={16} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">{v.duration}</div>
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{v.title}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye size={11} />{v.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={11} />{v.likes}</span>
                  <span className="flex items-center gap-1 ml-auto"><Calendar size={11} />{v.uploadDate}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Video modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="bg-card rounded-2xl overflow-hidden max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-black aspect-video">
              <img src={activeVideo.thumbnail} alt={activeVideo.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" fill="white" />
                </div>
                <a
                  href={`https://youtube.com/watch?v=${activeVideo.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white text-sm font-semibold flex items-center gap-1.5 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ExternalLink size={13} /> Buka di YouTube
                </a>
              </div>
            </div>
            <div className="p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-foreground">{activeVideo.title}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                  <span>{activeVideo.channelName}</span>
                  <span className="flex items-center gap-1"><Eye size={11} />{activeVideo.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={11} />{activeVideo.likes}</span>
                </div>
              </div>
              <button onClick={() => setActiveVideo(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Watchlist({ videos }: { videos: VideoItem[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "trending" | "updated">("all");

  const filtered = videos.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch = v.title.toLowerCase().includes(q) || v.channelName.toLowerCase().includes(q);
    const matchFilter = filter === "all" || v.status === filter;
    return matchSearch && matchFilter;
  });

  const statusIcon = (s: VideoItem["status"]) => ({
    new: <Clock size={13} className="text-blue-500" />,
    trending: <Flame size={13} className="text-red-500" />,
    updated: <TrendingUp size={13} className="text-green-500" />,
  })[s];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Watchlist / Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Video yang sedang dipantau dari semua channel.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari video atau channel…"
            className="pl-8 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 w-64"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-lg p-1">
          {(["all", "new", "trending", "updated"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${filter === f ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f === "all" ? "Semua" : f === "new" ? "Baru" : f === "trending" ? "Trending" : "Updated"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter size={13} />{filtered.length} video
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Video</th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Channel</th>
              <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Views</th>
              <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">Likes</th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Ditambahkan</th>
              <th className="text-center px-5 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr key={v.id} className={`border-b border-border last:border-0 hover:bg-secondary/40 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={v.thumbnail} alt={v.title} className="w-16 h-10 rounded-lg object-cover bg-secondary" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">{v.duration}</div>
                    </div>
                    <div className="font-semibold text-foreground line-clamp-2 leading-snug max-w-[240px]">{v.title}</div>
                  </div>
                </td>
                <td className="px-5 py-3 hidden sm:table-cell text-muted-foreground">{v.channelName}</td>
                <td className="px-5 py-3 hidden md:table-cell text-right font-semibold text-foreground">{v.views}</td>
                <td className="px-5 py-3 hidden md:table-cell text-right text-muted-foreground">{v.likes}</td>
                <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">{v.uploadDate}</td>
                <td className="px-5 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {statusIcon(v.status)}
                    <StatusBadge status={v.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Tidak ada video ditemukan.</div>
        )}
      </div>
    </div>
  );
}

function SettingsPage({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Konfigurasi aplikasi YT Channel Monitor.</p>
      </div>

      <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-foreground text-sm">Dark Mode</div>
            <div className="text-xs text-muted-foreground">Gunakan tema gelap untuk kenyamanan mata.</div>
          </div>
          <button
            onClick={onToggleDark}
            className={`w-11 h-6 rounded-full transition-colors relative ${dark ? "bg-primary" : "bg-switch-background"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${dark ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
        <div className="px-5 py-4">
          <div className="font-semibold text-foreground text-sm mb-1">Interval Refresh</div>
          <div className="text-xs text-muted-foreground mb-3">Seberapa sering data channel diperbarui.</div>
          <select className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40">
            <option>Setiap 1 jam</option>
            <option>Setiap 6 jam</option>
            <option>Setiap 12 jam</option>
            <option>Setiap 24 jam</option>
          </select>
        </div>
        <div className="px-5 py-4">
          <div className="font-semibold text-foreground text-sm mb-1">Notifikasi</div>
          <div className="text-xs text-muted-foreground mb-3">Aktifkan notifikasi saat video baru ditemukan.</div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
            <span className="text-sm text-foreground">Video baru dari channel terpantau</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
            <span className="text-sm text-foreground">Perubahan views signifikan (trending)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" className="accent-primary w-4 h-4" />
            <span className="text-sm text-foreground">Pertumbuhan subscriber mingguan</span>
          </label>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl px-5 py-4">
        <div className="font-semibold text-foreground text-sm mb-1">Tentang</div>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <div>YT Channel Monitor v1.0.0</div>
          <div>Pantau channel YouTube favoritmu dengan mudah.</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

type Page = "dashboard" | "add" | "channels" | "watchlist" | "settings" | "detail";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "add", label: "Tambah Channel", icon: PlusCircle },
  { id: "channels", label: "Semua Channel", icon: Tv2 },
  { id: "watchlist", label: "Monitoring", icon: BookmarkCheck },
  { id: "settings", label: "Pengaturan", icon: Settings },
] as const;

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [dark, setDark] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleSelectChannel(ch: Channel) {
    setSelectedChannel(ch);
    setPage("detail");
  }

  function handleAddChannel(ch: Channel) {
    setChannels((prev) => [ch, ...prev]);
  }

  function navigate(p: Page) {
    setPage(p);
    setSidebarOpen(false);
  }

  return (
    <div className={dark ? "dark" : ""} style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar backdrop (mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-60 bg-sidebar flex flex-col border-r border-sidebar-border transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Play size={13} className="text-white ml-0.5" fill="white" />
            </div>
            <div className="leading-none">
              <div className="text-sm font-bold text-sidebar-foreground">YT Monitor</div>
              <div className="text-[10px] text-sidebar-foreground/50 font-medium tracking-wide uppercase mt-0.5">Channel Dashboard</div>
            </div>
            <button className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {NAV.map(({ id, label, icon: Icon }) => {
              const active = page === id || (id === "channels" && page === "detail");
              return (
                <button
                  key={id}
                  onClick={() => navigate(id as Page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${active ? "bg-primary text-white" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=36&h=36&fit=crop&auto=format" alt="user" className="w-8 h-8 rounded-full object-cover ring-2 ring-sidebar-border" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-sidebar-foreground truncate">Admin User</div>
                <div className="text-[10px] text-sidebar-foreground/50 truncate">admin@ytmonitor.id</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="bg-card border-b border-border px-5 py-3.5 flex items-center gap-4 flex-shrink-0">
            <button className="lg:hidden text-muted-foreground hover:text-foreground p-1" onClick={() => setSidebarOpen(true)}>
              <BarChart2 size={20} />
            </button>

            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Cari channel, video…"
                className="w-full pl-8 pr-4 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
              </button>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&auto=format" alt="user" className="w-8 h-8 rounded-full object-cover ring-2 ring-border cursor-pointer" />
            </div>
          </header>

          {/* Page */}
          <main className="flex-1 overflow-y-auto p-6 [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent] hover:[scrollbar-color:var(--muted-foreground)_transparent]">
            {page === "dashboard" && <Dashboard channels={channels} onSelectChannel={handleSelectChannel} />}
            {page === "add" && <AddChannel onAdd={handleAddChannel} />}
            {page === "channels" && page !== "detail" && <AllChannels channels={channels} onSelectChannel={handleSelectChannel} />}
            {page === "detail" && selectedChannel && (
              <ChannelDetail
                channel={selectedChannel}
                videos={MOCK_VIDEOS}
                onBack={() => setPage("channels")}
              />
            )}
            {page === "watchlist" && <Watchlist videos={MOCK_VIDEOS} />}
            {page === "settings" && <SettingsPage dark={dark} onToggleDark={() => setDark((d) => !d)} />}
          </main>
        </div>
      </div>
    </div>
  );
}
