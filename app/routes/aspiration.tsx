import { useState } from 'react';

import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import type { Category } from '@/types/aspiration';

import { AGENCIES, CATEGORIES } from '@/constants/aspirations';
import { APP_NAME } from '@/constants/index';

import { ArrowLeft, Megaphone, Send, ShieldCheck } from 'lucide-react';

import type { Route } from './+types/aspiration';

export const meta: Route.MetaFunction = () => [
  { title: `Tulis Aspirasi - ${APP_NAME}` },
  {
    name: 'description',
    content: 'Sampaikan aspirasi, keluhan, dan masukan Anda untuk kemajuan kota.',
  },
];

export default function AspirationPage() {
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<Category>('Infrastruktur');
  const [agency, setAgency] = useState(AGENCIES[0] ?? 'Dinas PUPR');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `ASP-2026-${randomSuffix}`;

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Aspirasi berhasil dikirim! Kode Tiket: ${newId}`);
      navigate('/');
    }, 400);
  };

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-darknavy-900 hover:text-accent-500 inline-flex items-center gap-2 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <Card className="soft-card border-warm-200 overflow-hidden rounded-3xl">
          <CardHeader className="bg-darknavy-900 p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-accent-500 flex h-10 w-10 items-center justify-center rounded-2xl text-white">
                <Megaphone className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-xl font-extrabold text-white">
                  Formulir Aspirasi Warga
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Suara Anda sangat berarti untuk transparansi dan kemajuan bersama.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anonymous Mode Switch */}
              <div className="border-warm-200 bg-warm-100 flex items-center justify-between rounded-2xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="text-accent-500 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <label
                      htmlFor="anon-switch"
                      className="text-darknavy-900 cursor-pointer text-xs font-bold"
                    >
                      Kirim sebagai Anonim
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Identitas Anda tidak akan ditampilkan ke publik.
                    </p>
                  </div>
                </div>
                <Switch id="anon-switch" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              </div>

              {/* Author and Location Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="author-input"
                    className="text-darknavy-900 mb-1 block text-xs font-bold"
                  >
                    Nama Lengkap
                  </label>
                  <Input
                    id="author-input"
                    type="text"
                    required={!isAnonymous}
                    disabled={isAnonymous}
                    value={isAnonymous ? 'Warga Anonim' : author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="border-warm-200 bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location-input"
                    className="text-darknavy-900 mb-1 block text-xs font-bold"
                  >
                    Lokasi / Kecamatan
                  </label>
                  <Input
                    id="location-input"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Kec. Coblong, RT 02"
                    className="border-warm-200 bg-white"
                  />
                </div>
              </div>

              {/* Category & Agency Selects */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category-select"
                    className="text-darknavy-900 mb-1 block text-xs font-bold"
                  >
                    Kategori Laporan
                  </label>
                  <Select value={category} onValueChange={(val) => setCategory(val as Category)}>
                    <SelectTrigger id="category-select" className="border-warm-200 bg-white">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter((c) => c !== 'semua').map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="agency-select"
                    className="text-darknavy-900 mb-1 block text-xs font-bold"
                  >
                    Instansi Tujuan
                  </label>
                  <Select value={agency} onValueChange={setAgency}>
                    <SelectTrigger id="agency-select" className="border-warm-200 bg-white">
                      <SelectValue placeholder="Pilih Instansi" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENCIES.map((instansi) => (
                        <SelectItem key={instansi} value={instansi}>
                          {instansi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label
                  htmlFor="title-input"
                  className="text-darknavy-900 mb-1 block text-xs font-bold"
                >
                  Judul Aspirasi / Keluhan
                </label>
                <Input
                  id="title-input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ringkasan singkat masalah (misal: Penerangan jalan mati)"
                  className="border-warm-200 bg-white"
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label
                  htmlFor="content-input"
                  className="text-darknavy-900 mb-1 block text-xs font-bold"
                >
                  Detail Aspirasi
                </label>
                <Textarea
                  id="content-input"
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Jelaskan secara rinci kronologi, lokasi spesifik, dampak bagi warga sekitar..."
                  className="border-warm-200 bg-white"
                />
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="coral-glow bg-accent-500 hover:bg-accent-600 flex w-full items-center justify-center gap-2 rounded-full py-6 text-xs font-bold text-white shadow-lg"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>{isSubmitting ? 'Mengirim Aspirasi...' : 'Kirim Aspirasi Sekarang'}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
