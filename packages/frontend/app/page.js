import Header from './components/Header';
import HomeSection from './components/sections/HomeSection';
import AboutSection from './components/sections/AboutSection';
import JokiSection from './components/sections/JokiSection';
import JasaSection from './components/sections/JasaSection';
import ReviewSection from './components/sections/ReviewSection';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HomeSection />
        <AboutSection />
        <JokiSection />
        <JasaSection />
        <ReviewSection />
        <ContactSection />
      </main>
      {/* Tambahkan komponen Footer di sini */}
      <Footer />
    </>
  );
}