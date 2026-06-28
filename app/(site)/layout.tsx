import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StickyWhatsApp from "@/components/StickyWhatsApp";

// Public-site chrome: nav + footer + sticky WhatsApp. Admin lives outside this
// group (app/admin) so it gets none of it. URLs are unchanged (route groups are
// invisible in the path).
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      {children}
      <SiteFooter />
      <StickyWhatsApp />
    </>
  );
}
