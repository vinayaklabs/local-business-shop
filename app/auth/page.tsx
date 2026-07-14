import { AuthPageClient } from "@/components/AuthPageClient";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "login";

  return <AuthPageClient mode={mode} />;
}
