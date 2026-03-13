import NavBar from "@/components/layout/nav-bar/NavBar";
import Profile from "./pages/profile/Profile";
import Footer from "@/components/layout/footer/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <Profile/>
      <Footer/>
    </>
  );
}
