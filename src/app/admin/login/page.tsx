import { PagesEditHelp } from "@/components/PagesEditHelp";
import { isGitHubPages } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (isGitHubPages) {
    return <PagesEditHelp />;
  }
  const { default: NodeAdminLogin } = await import("./node-login");
  return <NodeAdminLogin />;
}
