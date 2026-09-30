export type Category =
  | 'semua'
  | 'Infrastruktur'
  | 'Pelayanan Publik'
  | 'Kebersihan & Lingkungan'
  | 'Kesehatan';

export type TicketStatus = 'Selesai' | 'Dalam Proses' | 'Terverifikasi';

export interface Aspiration {
  id: string;
  author: string;
  location: string;
  category: Category;
  agency: string;
  title: string;
  content: string;
  status: TicketStatus;
  statusBg: string;
  votes: number;
  comments: number;
  date: string;
  voted: boolean;
}

export interface NewAspirationInput {
  author: string;
  location: string;
  category: Category;
  agency: string;
  title: string;
  content: string;
  isAnonymous: boolean;
}
