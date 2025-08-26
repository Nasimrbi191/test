import Footer from '../../components/Footer/Footer'
import TestimonialSlider from '../../components/Testimonial/TestimonialSlider'
import Services from '../../components/Services/Services'
import Navbar from '../../components/Navbar/Navbar'
import HeroSection from '../../HeroSection/HeroSection'
import ScrollTextSection from '../../components/ScrollTextSection/ScrollTextSection '
import BackToTopButton from '../../components/BackToUp/BackToUp'

function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />
            <Services />
            <ScrollTextSection />
            <TestimonialSlider />
            <BackToTopButton />
            <Footer />
        </>
    )
}

export default Home
