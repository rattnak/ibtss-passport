import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const CAPTION = "AI in Higher Education: From Challenge to Opportunity (Fort Hays State University × American University of Phnom Penh). #IBTSS2026 #AIinEducation #FHSU";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = supabaseAdmin();
  const { data } = await db
    .from("passport_progress")
    .select("name, is_complete")
    .eq("id", id)
    .single();

  const title = data?.is_complete
    ? `${data.name} completed the IBTSS 2026 AI Learning Passport!`
    : "IBTSS 2026 AI Learning Passport";

  const description = data?.is_complete
    ? `I completed all three AI tool stations at the IBTSS 2026 Pre-Conference Workshop — ${CAPTION}`
    : CAPTION;

  const url = `${BASE_URL}/passport/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "IBTSS 2026 AI Learning Passport",
      images: [`${BASE_URL}/FHSU-Ai.png`],
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [`${BASE_URL}/FHSU-Ai.png`],
    },
  };
}

export default function PassportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
