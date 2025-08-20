import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css'; // base styles
import 'swiper/css/pagination'; // pagination styles
import 'swiper/css/navigation'; // navigation styles
import '../../styles/TestimonialSlider.scss';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Jane Doe',
    role: 'Product Manager',
    quote: 'This service transformed our workflow with its intuitive design and exceptional support.',
    image: '/profile.webp', // Replace with actual image path
  },
  {
    id: 2,
    name: 'John Smith',
    role: 'Software Engineer',
    quote: 'The team delivered beyond expectations, providing innovative solutions tailored to our needs.',
    image: '/selfie-ideas.webp',
  },
  {
    id: 3,
    name: 'Emily Brown',
    role: 'Marketing Director',
    quote: 'An outstanding experience! The platform is user-friendly and visually stunning.',
    image: '/tips.webp',
  },
];


const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const TestimonialSlider = () => {
  const { t } = useTranslation();
  return (
    <section className="testimonial-section" dir='ltr'>
      <Container maxWidth="lg" className="services-container">
        <h2 className="testimonial-title">{t('What Our Clients Say')}</h2>
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          className="testimonial-swiper"
          breakpoints={{
            768: {
              pagination: {
                dynamicBullets: true,
              }
            },
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="testimonial-slide">
                <motion.div
                  className="testimonial-content"
                  initial="hidden"
                  animate="visible"
                >
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="testimonial-image"
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                  />
                  <p className="testimonial-quote">"{t(testimonial.quote)}"</p>
                  <h3 className="testimonial-name">{t(testimonial.name)}</h3>
                  <p className="testimonial-role">{t(testimonial.role)}</p>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
      <div className="testimonial-bg-element"></div>
      <div className="testimonial-bg-element"></div>
    </section>
  );
};

export default TestimonialSlider;