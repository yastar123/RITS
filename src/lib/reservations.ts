export type Reservation = {
  code: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  note?: string;
  status: "Menunggu Konfirmasi" | "Terkonfirmasi" | "Selesai";
  createdAt: string;
};

const KEY = "ris-reservations";

export type ServiceOption = {
  name: string;
  price: number;
  duration: string;
  description: string;
};

export const serviceOptions: ServiceOption[] = [
  {
    name: "Akupunktur",
    price: 150000,
    duration: "± 60 menit",
    description: "Penusukan titik meridian untuk meredakan nyeri dan menyeimbangkan energi tubuh.",
  },
  {
    name: "Herbal Formula",
    price: 120000,
    duration: "± 30 menit",
    description: "Konsultasi dan peresepan formula herbal sesuai pola tubuh Anda.",
  },
  {
    name: "Tuina",
    price: 130000,
    duration: "± 60 menit",
    description: "Terapi pijat tekan TCM untuk otot kaku, pegal, dan gangguan sendi.",
  },
  {
    name: "BSM (Body Space Medicine)",
    price: 175000,
    duration: "± 45 menit",
    description: "Pendekatan pergerakan energi antar organ untuk keluhan kronis.",
  },
  {
    name: "Konseling",
    price: 100000,
    duration: "± 45 menit",
    description: "Sesi bicara terarah untuk stres, kecemasan, dan pemulihan emosi.",
  },
  {
    name: "Audioterapi",
    price: 90000,
    duration: "± 30 menit",
    description: "Terapi frekuensi suara untuk relaksasi dan kualitas tidur.",
  },
];

export const services = serviceOptions.map((s) => s.name);

export function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function loadReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Reservation[];
  } catch {
    return [];
  }
}

export function saveReservation(data: Omit<Reservation, "code" | "status" | "createdAt">) {
  const reservation: Reservation = {
    ...data,
    code: `RIS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    status: "Menunggu Konfirmasi",
    createdAt: new Date().toISOString(),
  };
  const all = loadReservations();
  all.unshift(reservation);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return reservation;
}

export function findReservation(query: string): Reservation | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return loadReservations().find(
    (r) => r.code.toLowerCase() === q || r.phone.replace(/\s/g, "") === q.replace(/\s/g, ""),
  );
}
