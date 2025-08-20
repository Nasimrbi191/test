import Footer from '../../components/Footer/Footer'
import TestimonialSlider from '../../components/Testimonial/TestimonialSlider'
import Services from '../../components/Services/Services'
import Slider from '../../components/Slider/Slider'
import Navbar from '../../components/Navbar/Navbar'

function Home() {
    return (
        <>
            <Navbar />
            <Slider />
            <Services />
            <TestimonialSlider />
            <Footer />
        </>
    )
}

export default Home
