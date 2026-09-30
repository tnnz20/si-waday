import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import type { Aspiration, Category } from '@/types/aspiration';

import {
  Building2,
  Construction,
  FileText,
  FolderOpen,
  Heart,
  HeartPulse,
  MessageSquare,
  Search,
  Trees,
  User,
} from 'lucide-react';

interface FeedProps {
  aspirations: Aspiration[];
  currentCategory: Category;
  searchQuery: string;
  onCategoryChange: (cat: Category) => void;
  onSearchChange: (query: string) => void;
  onToggleVote: (id: string) => void;
  onOpenTrackModal: (ticketId: string) => void;
}

const CATEGORIES: Array<{ id: Category; label: string; icon: typeof Construction | null }> = [
  { id: 'semua', label: 'Semua Kategori', icon: null },
  { id: 'Infrastruktur', label: 'Infrastruktur', icon: Construction },
  { id: 'Pelayanan Publik', label: 'Pelayanan Publik', icon: FileText },
  { id: 'Kebersihan & Lingkungan', label: 'Lingkungan', icon: Trees },
  { id: 'Kesehatan', label: 'Kesehatan', icon: HeartPulse },
];

export function Feed({
  aspirations,
  currentCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onToggleVote,
  onOpenTrackModal,
}: FeedProps) {
  const filtered = aspirations.filter((item) => {
    const matchesCategory = currentCategory === 'semua' || item.category === currentCategory;
    const lowerQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      lowerQuery === '' ||
      item.title.toLowerCase().includes(lowerQuery) ||
      item.content.toLowerCase().includes(lowerQuery) ||
      item.author.toLowerCase().includes(lowerQuery) ||
      item.location.toLowerCase().includes(lowerQuery) ||
      item.id.toLowerCase().includes(lowerQuery);

    return matchesCategory && matchesSearch;
  });

  const handleVoteClick = (id: string, currentVoted: boolean) => {
    onToggleVote(id);
    if (!currentVoted) {
      toast.success('Terima kasih! Dukungan Anda tercatat.');
    } else {
      toast.info('Dukungan dibatalkan.');
    }
  };

  return (
    <section id="aspirasi" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Search Bar */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-accent-500 mb-2 block text-xs font-bold tracking-widest uppercase">
              PARTISIPASI PUBLIK
            </span>
            <h2 className="text-darknavy-900 text-3xl font-extrabold">
              Aspirasi &amp; Suara Warga Terkini
            </h2>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full md:w-80">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari topik, lokasi, atau ID..."
              className="border-warm-300 bg-warm-100 focus-visible:ring-accent-500 rounded-full py-6 pr-4 pl-10 text-xs shadow-none"
            />
            <Search className="absolute top-4 left-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 flex scrollbar-none items-center gap-2 overflow-x-auto pb-4">
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const isActive = currentCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onCategoryChange(id)}
                className={`flex items-center gap-1.5 rounded-full px-6 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-darknavy-900 text-white shadow-md'
                    : 'bg-warm-100 hover:bg-warm-200 text-slate-600'
                }`}
              >
                {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Aspirations Grid or Empty State */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <Card
                key={item.id}
                className="soft-card flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Card Author & Status Header */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-warm-200 text-darknavy-900 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="text-darknavy-900 text-xs font-bold">{item.author}</h4>
                        <p className="text-2xs text-slate-400">
                          {item.location} • {item.date}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-2xs rounded-full border-none px-3 py-1 font-bold ${item.statusBg}`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  {/* Title (Interactive Track Link) */}
                  <button
                    type="button"
                    onClick={() => onOpenTrackModal(item.id)}
                    className="text-darknavy-900 hover:text-accent-500 mb-2 text-left text-base font-bold transition-colors"
                  >
                    {item.title}
                  </button>

                  {/* Description Snippet */}
                  <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-500">
                    {item.content}
                  </p>
                </div>

                <div>
                  {/* Agency & Ticket Code Info Bar */}
                  <div className="bg-warm-100 border-warm-200 text-2xs mb-4 flex items-center justify-between rounded-2xl border p-3">
                    <span className="flex items-center gap-1 font-bold text-slate-600">
                      <Building2 className="text-accent-500 h-3.5 w-3.5" aria-hidden="true" />
                      <span>{item.agency}</span>
                    </span>
                    <span className="font-mono text-slate-400">{item.id}</span>
                  </div>

                  {/* Upvote & Comments Footer */}
                  <div className="border-warm-200 flex items-center justify-between border-t pt-3 text-xs">
                    <button
                      type="button"
                      onClick={() => handleVoteClick(item.id, item.voted)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold transition-all ${
                        item.voted
                          ? 'bg-accent-50 text-accent-500'
                          : 'hover:bg-warm-100 text-slate-400'
                      }`}
                    >
                      <Heart
                        className={`text-accent-500 h-3.5 w-3.5 ${item.voted ? 'fill-accent-500' : ''}`}
                        aria-hidden="true"
                      />
                      <span>{item.votes}</span>
                    </button>
                    <span className="text-2xs flex items-center gap-1 font-medium text-slate-400">
                      <MessageSquare className="h-3 w-3" aria-hidden="true" />
                      <span>{item.comments} Tanggapan</span>
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-warm-100 border-warm-300 mt-6 rounded-3xl border border-dashed py-16 text-center">
            <FolderOpen className="mx-auto mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
            <h3 className="text-darknavy-900 text-base font-bold">Tidak ada aspirasi ditemukan</h3>
            <p className="mt-1 text-xs text-slate-500">
              Coba kata kunci lain atau pilih kategori yang berbeda.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
