import { PagesEditHelp } from "@/components/PagesEditHelp";
import { isGitHubPages } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (isGitHubPages) {
    return <PagesEditHelp />;
  }
  const { default: NodeAdminPage } = await import("./node-admin");
  return <NodeAdminPage />;
}
