import { useState, useEffect } from "react";
import { Header } from "../components/navbar/header";
import { Footer } from "../components/footer/footer";
import { Sidebar } from "../components/navbar/sidebar";

export function MainLayout({ withNavigation = true, withSidebar = false, children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false); // Always open on desktop, closed on mobile
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Backdrop click closes sidebar on mobile
  const handleBackdropClick = () => {
    if (isMobile && sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header withNavigation={withNavigation} />

      {/* Desktop Sidebar */}
      {withSidebar && !isMobile && (
        <div className="fixed top-[64px] left-0 z-30 h-[calc(100vh-64px)]">
          <Sidebar isMobile={false} isOpen={true} />
        </div>
      )}

      <div className={`flex relative ${withSidebar && !isMobile ? 'pl-72' : ''}`}>
        {/* Mobile Backdrop */}
        {withSidebar && isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={handleBackdropClick}
          />
        )}

        {/* Mobile Sidebar */}
        {withSidebar && isMobile && (
          <div
            className={`fixed top-[64px] left-0 z-50 transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ width: "18rem" }}
          >
            <Sidebar
              isMobile={true}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main Content */}
        <main
          className="flex-1 flex flex-col min-h-[calc(100vh-64px)]"
        >
          {/* Mobile Sidebar Toggle Button */}
          {withSidebar && isMobile && (
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="fixed top-20 left-4 z-50 bg-slate-900 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Toggle sidebar"
            >
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  sidebarOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Page Content */}
          <div>{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}