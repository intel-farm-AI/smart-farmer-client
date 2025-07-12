import { Header } from "../components/navbar/header";
import { Footer } from "../components/footer/footer";

export function MainLayout({ withNavigation = true, children }) {
  return (
    <>
      <Header withNavigation={withNavigation} />
      <main>{children}</main>
      <Footer />
    </>
  );
}