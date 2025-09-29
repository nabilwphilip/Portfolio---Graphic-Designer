import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppCTA from "../ui/whatsapp-cta";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <WhatsAppCTA />
    </div>
  );
};

export default Layout;