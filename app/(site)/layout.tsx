import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import { IntentProvider } from "@/components/IntentProvider";

// Public-site chrome: nav + footer + sticky WhatsApp, all inside IntentProvider so
// the nav chip + first-visit chooser overlay share one trip-intent context. Admin
// lives outside this group (app/admin) so it gets none of it. URLs are unchanged
// (route groups are invisible in the path).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <IntentProvider>
      <SiteNav />
      {children}
      <SiteFooter />
      <StickyWhatsApp />
    </IntentProvider>
  );
}
