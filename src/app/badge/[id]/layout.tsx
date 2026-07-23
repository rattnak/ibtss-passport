import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { BADGE_TITLE, BADGE_DESCRIPTION } from "@/components/WorkshopCredentialSummary";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

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
    ? `${data.name} earned the ${BADGE_TITLE} badge`
    : BADGE_TITLE;

  const description = BADGE_DESCRIPTION;

  const url = `${BASE_URL}/badge/${id}`;

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

export default function BadgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
