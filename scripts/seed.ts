import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "../server/db";
import { articles, users } from "../server/db/schema";

const defaultArticles = [
  {
    category: "Akupunktur",
    title: "Apa yang sebenarnya terjadi saat jarum masuk?",
    excerpt: "Penjelasan sederhana tentang titik meridian, respons saraf, dan mengapa sensasi 'de qi' itu penting.",
    content: "Akupunktur bekerja dengan menstimulasi titik-titik tertentu pada tubuh. Dalam pendekatan TCM, titik ini berada di sepanjang meridian dan dipilih sesuai pola ketidakseimbangan pasien. Sensasi de qi merupakan respons ringan yang dapat membantu praktisi memastikan stimulasi berada di area yang tepat.",
    readTime: "5 menit",
  },
  {
    category: "Herbal",
    title: "Mengapa racikan herbal Anda berbeda dari orang lain",
    excerpt: "Formula TCM disusun mengikuti sindrom, bukan nama penyakit. Ini alasan takarannya sering berubah.",
    content: "Dalam TCM, dua orang dengan keluhan yang sama belum tentu memiliki pola tubuh yang sama. Karena itu, racikan herbal disusun setelah konsultasi dan dapat disesuaikan mengikuti respons tubuh dari waktu ke waktu.",
    readTime: "4 menit",
  },
  {
    category: "Pola Hidup",
    title: "Ritme harian organ dan jam tidur yang ideal",
    excerpt: "Jam organ dalam TCM dan bagaimana menyesuaikan rutinitas agar pemulihan lebih cepat.",
    content: "Tidur yang cukup, waktu makan yang teratur, dan jeda dari layar membantu tubuh menjaga ritmenya. Jadikan perubahan kecil dan konsisten sebagai bagian dari proses pemulihan.",
    readTime: "6 menit",
  },
  {
    category: "Tuina",
    title: "Kaku leher berulang: bukan hanya soal otot",
    excerpt: "Pola stagnasi qi yang sering menyertai keluhan leher dan bahu pada pekerja layar.",
    content: "Keluhan leher dapat dipengaruhi postur, stres, kualitas tidur, dan kebiasaan kerja. Tuina menggunakan pijatan dan tekanan terarah sebagai bagian dari pendekatan menyeluruh.",
    readTime: "5 menit",
  },
  {
    category: "BSM",
    title: "Mengenal Body Space Medicine untuk kasus kronis",
    excerpt: "Bagaimana konsep ruang tubuh membantu membuka aliran pada keluhan yang lama menetap.",
    content: "Body Space Medicine melihat hubungan antarbagi tubuh dan ruang gerak yang terbentuk dari kebiasaan sehari-hari. Pemeriksaan dilakukan untuk membantu menemukan area yang membutuhkan perhatian.",
    readTime: "7 menit",
  },
  {
    category: "Audioterapi",
    title: "Frekuensi, napas, dan kualitas tidur",
    excerpt: "Peran terapi suara sebagai penunjang relaksasi sistem saraf parasimpatis.",
    content: "Suara yang menenangkan dapat menjadi bagian dari rutinitas relaksasi. Padukan dengan napas perlahan, cahaya redup, dan waktu tidur yang konsisten untuk menciptakan suasana istirahat.",
    readTime: "4 menit",
  },
];

async function seed() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@rumahterapy.id").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD wajib diatur dan minimal 8 karakter.");
  }

  const db = getDb();
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const [existingAdmin] = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);

  if (existingAdmin) {
    await db.update(users).set({ passwordHash, role: "admin" }).where(eq(users.id, existingAdmin.id));
  } else {
    await db.insert(users).values({ email: adminEmail, passwordHash, role: "admin" });
  }

  const [existingArticle] = await db.select({ id: articles.id }).from(articles).limit(1);
  if (!existingArticle) {
    await db.insert(articles).values(defaultArticles);
  }

  console.log(`Admin siap: ${adminEmail}`);
  console.log(existingArticle ? "Artikel existing dipertahankan." : `${defaultArticles.length} artikel awal dibuat.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});