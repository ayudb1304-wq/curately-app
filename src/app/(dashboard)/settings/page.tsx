import { auth } from "@/auth";
import { SovereigntyCenter } from "@/components/settings/sovereignty-center";

export default async function SettingsPage() {
  const session = await auth();
  return <SovereigntyCenter session={session} />;
}

