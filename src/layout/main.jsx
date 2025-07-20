import { Header } from "../components/navbar/header";
import { Footer } from "../components/footer/footer";
import { Sidebar } from "../components/navbar/sidebar";

export function MainLayout({ withNavigation = true, withSidebar = false, children }) {
  return (
    <>
      <Header withNavigation={withNavigation} />
      <div className="flex min-h-[calc(100vh-64px)]">
        {withSidebar && <Sidebar />}
        <main className="flex-1">
          {children}
          <Footer />
        </main>
      </div>
    </>
  );
}