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

export interface IdentityFormData {
  nik: string;
  fullName: string;
  phone: string;
  email: string;
  ktpAddress: string;
  identityType: string;
  idCardFileName: string;
  idCardPreviewUrl: string;
  idCardFile?: File | null;
}

export interface FormPhotoItem {
  id: string;
  file: File;
  fileName: string;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
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
  proposalFile?: File | null;
  photos?: FormPhotoItem[];
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
  photos?: FormPhotoItem[];
  documentFileName: string;
  documentFile?: File | null;
}

export interface AppSatisfactionRating {
  rating: number;
  aspects: string[];
  feedback: string;
}
