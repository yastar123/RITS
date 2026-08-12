import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const profileSchema = z.object({
  full_name: z.string().min(2).max(100),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  age: z.coerce.number().int().min(1).max(120),
  height: z.coerce.number().int().min(1).max(300),
  weight: z.coerce.number().int().min(1).max(500),
  phone: z.string().min(8).max(20),
  address: z.string().min(5).max(500),
  referral_code: z.string().max(50).optional().or(z.literal("")),
  tongue_photo_url: z.string().url().max(1000).optional().or(z.literal("")),
});

export const signUpWithProfile = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email().max(255),
      password: z.string().min(8).max(100),
      profile: profileSchema,
    }).parse,
  )
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    type Database = import("@/integrations/supabase/types").Database;

    const supabaseAdmin = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.profile.full_name,
      },
    });

    if (signUpError || !signUpData.user) {
      throw new Error(signUpError?.message ?? "Gagal membuat akun");
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          user_id: signUpData.user.id,
          full_name: data.profile.full_name,
          gender: data.profile.gender,
          age: data.profile.age,
          height: data.profile.height,
          weight: data.profile.weight,
          phone: data.profile.phone,
          address: data.profile.address,
          referral_code: data.profile.referral_code || null,
          tongue_photo_url: data.profile.tongue_photo_url || null,
        },
        { onConflict: "user_id" },
      );

    if (profileError) {
      throw new Error(profileError.message ?? "Gagal menyimpan profil");
    }

    return { userId: signUpData.user.id, email: signUpData.user.email };
  });

export const signInWithEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email().max(255),
      password: z.string().min(1).max(100),
    }).parse,
  )
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    type Database = import("@/integrations/supabase/types").Database;

    const supabase = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !signInData.session) {
      throw new Error(error?.message ?? "Email atau password salah");
    }

    return {
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
      expires_at: signInData.session.expires_at,
      user: signInData.user,
    };
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", context.userId)
      .single();

    if (error) {
      throw new Error(error.message ?? "Gagal memuat profil");
    }

    return data;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(profileSchema.parse)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        gender: data.gender,
        age: data.age,
        height: data.height,
        weight: data.weight,
        phone: data.phone,
        address: data.address,
        referral_code: data.referral_code || null,
        tongue_photo_url: data.tongue_photo_url || null,
      })
      .eq("user_id", context.userId);

    if (error) {
      throw new Error(error.message ?? "Gagal memperbarui profil");
    }

    return { ok: true };
  });
