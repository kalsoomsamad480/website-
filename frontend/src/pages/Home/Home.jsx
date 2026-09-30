import SEO from '../../components/common/SEO/SEO';
import ReservationCTA from '../../components/common/ReservationCTA/ReservationCTA';
import Hero from '../../components/home/Hero/Hero';
import FeaturedMenu from '../../components/home/FeaturedMenu/FeaturedMenu';
import AboutTeaser from '../../components/home/AboutTeaser/AboutTeaser';
import StudySpaceHighlight from '../../components/home/StudySpaceHighlight/StudySpaceHighlight';
import OffersSection from '../../components/home/OffersSection/OffersSection';
import Testimonials from '../../components/home/Testimonials/Testimonials';
import GalleryPreview from '../../components/home/GalleryPreview/GalleryPreview';

function Home() {
  return (
    <>
      <SEO description="Alladin Cafe is a neighborhood cafe and calm study space. Browse the menu, order online, and reserve a table or study desk." />
      <Hero />
      <FeaturedMenu />
      <AboutTeaser />
      <StudySpaceHighlight />
      <OffersSection />
      <Testimonials />
      <GalleryPreview />
      <ReservationCTA />
    </>
  );
}

export default Home;
