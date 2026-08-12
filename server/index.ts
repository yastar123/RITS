import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { and, eq, or } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { profiles, reservations, sessions, users } from "./db/schema";

const app = express();
app.use(express.json({ limit: "2mb" }));

function sessionUser(req: express.Request) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  return { token };
}

async function requireUser(req: express.Request, res: express.Response) {
  const session = sessionUser(req);
  if (!session) { res.status(401).json({ message: "Silakan masuk terlebih dahulu." }); return null; }
  const db = getDb();
  const result = await db.select({ user: users, session: sessions })
    .from(sessions).innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, session.token)).limit(1);
  if (!result[0] || result[0].session.expiresAt < new Date()) {
    res.status(401).json({ message: "Sesi telah berakhir." }); return null;
  }
  return result[0].user;
}

function validateProfile(input: Record<string, unknown>) {
  const required = ["full_name", "gender", "phone", "address"];
  if (required.some((key) => typeof input[key] !== "string" || !String(input[key]).trim())) return false;
  return Number(input.age) > 0 && Number(input.height) > 0 && Number(input.weight) > 0;
}

app.get("/api/health", (_req, res) => res.json({ ok: true, database: Boolean(process.env.DATABASE_URL) }));

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, profile } = req.body as { email?: string; password?: string; profile?: Record<string, unknown> };
    if (!email || !password || password.length < 8 || !profile || !validateProfile(profile)) return res.status(400).json({ message: "Data pendaftaran belum lengkap." });
    const db = getDb();
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(users).values({ email: email.toLowerCase(), passwordHash }).returning();
    if (!user) return res.status(400).json({ message: "Gagal membuat akun." });
    await db.insert(profiles).values({ userId: user.id, fullName: String(profile.full_name), gender: String(profile.gender), age: Number(profile.age), height: Number(profile.height), weight: Number(profile.weight), phone: String(profile.phone), address: String(profile.address), referralCode: profile.referral_code ? String(profile.referral_code) : null, tonguePhotoUrl: null });
    res.status(201).json({ ok: true });
  } catch (error) { res.status(400).json({ message: error instanceof Error && error.message.includes("unique") ? "Email sudah terdaftar." : "Gagal membuat akun." }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const db = getDb();
    const [user] = await db.select().from(users).where(eq(users.email, String(req.body.email).toLowerCase())).limit(1);
    if (!user || !(await bcrypt.compare(String(req.body.password), user.passwordHash))) return res.status(401).json({ message: "Email atau password salah." });
    const token = randomBytes(32).toString("hex");
    await db.insert(sessions).values({ token, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) { res.status(500).json({ message: error instanceof Error ? error.message : "Gagal masuk." }); }
});

app.post("/api/auth/logout", async (req, res) => {
  const token = sessionUser(req)?.token;
  if (token) await getDb().delete(sessions).where(eq(sessions.token, token));
  res.json({ ok: true });
});

app.get("/api/auth/me", async (req, res) => {
  try {
    if (!sessionUser(req)) return res.json({ user: null });
    const user = await requireUser(req, res);
    if (user) res.json({ user });
  } catch (error) { res.status(503).json({ message: error instanceof Error ? error.message : "Database belum siap." }); }
});

app.get("/api/profile", async (req, res) => {
  try { const user = await requireUser(req, res); if (!user) return; const [profile] = await getDb().select().from(profiles).where(eq(profiles.userId, user.id)).limit(1); res.json(profile); } catch (error) { res.status(503).json({ message: error instanceof Error ? error.message : "Gagal memuat profil." }); }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const { name, phone, service, date, time, note } = req.body;
    if (![name, phone, service, date, time].every((value) => String(value ?? "").trim())) return res.status(400).json({ message: "Data reservasi belum lengkap." });
    const code = `RIS-${randomBytes(3).toString("hex").toUpperCase()}`;
    const [reservation] = await getDb().insert(reservations).values({ code, name, phone, service, date, time, note: note || null }).returning();
    res.status(201).json({ ...reservation, createdAt: reservation?.createdAt.toISOString() });
  } catch (error) { res.status(503).json({ message: error instanceof Error ? error.message : "Database belum siap." }); }
});

app.get("/api/reservations", async (req, res) => {
  try {
    const query = String(req.query.query ?? "").trim();
    if (!query) return res.json(null);
    const normalized = query.replace(/\s/g, "");
    const result = await getDb().select().from(reservations).where(or(eq(reservations.code, query.toUpperCase()), eq(reservations.phone, normalized))).limit(1);
    res.json(result[0] ?? null);
  } catch (error) { res.status(503).json({ message: error instanceof Error ? error.message : "Database belum siap." }); }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist/client"));
    app.get("*", (_req, res) => res.sendFile("index.html", { root: "dist/client" }));
  }
  app.listen(Number(process.env.PORT ?? 5000), "0.0.0.0", () => console.log("Express server berjalan di port 5000"));
}
start().catch((error) => { console.error(error); process.exit(1); });