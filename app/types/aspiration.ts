export type Category =
  'semua' | 'Infrastruktur' | 'Pelayanan Publik' | 'Kebersihan & Lingkungan' | 'Kesehatan';

export type TicketStatus = 'Selesai' | 'Dalam Proses' | 'Terverifikasi';

export type AspirationType = 'masyarakat' | 'dapil';

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

export interface IdentityFormData {
  nik: string;
  fullName: string;
  phone: string;
  email: string;
  ktpAddress: string;
  identityType: string;
  idCardFileName: string;
  idCardPreviewUrl: string;
}

export interface UsulanFormData {
  dapilId: string;
  dapilName: string;
  representativeId: string;
  representativeName: string;
  representativeParty: string;
  kamusUsulan: string;
  permasalahan: string;
  latitude: number;
  longitude: number;
  alamatLokasi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  proposalFileName: string;
  photo1PreviewUrl: string;
  photo1FileName: string;
  photo2PreviewUrl: string;
  photo2FileName: string;
  photo3PreviewUrl: string;
  photo3FileName: string;
  satisfactionRating: number;
  satisfactionAspects: string[];
  satisfactionFeedback: string;
}

export interface PublicComplaintFormData {
  category: string;
  agency: string;
  title: string;
  content: string;
  latitude: number;
  longitude: number;
  alamatLokasi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  photo1PreviewUrl: string;
  photo1FileName: string;
  photo2PreviewUrl: string;
  photo2FileName: string;
  photo3PreviewUrl: string;
  photo3FileName: string;
  documentFileName: string;
  satisfactionRating: number;
  satisfactionAspects: string[];
  satisfactionFeedback: string;
}

export interface AppSatisfactionRating {
  rating: number;
  aspects: string[];
  feedback: string;
}
