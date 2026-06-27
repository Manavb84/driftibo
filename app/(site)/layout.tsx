import { PersonaProvider } from "@/components/PersonaProvider";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

// Public-site chrome: persona system + nav + footer. Admin lives outside this
// group (app/admin) so it gets none of it. URLs are unchanged (route groups are
// invisible in the path).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PersonaProvider>
      <SiteNav />
      {children}
      <SiteFooter />
    </PersonaProvider>
  );
}
