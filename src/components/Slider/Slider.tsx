import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
// Main CSS
import 'swiper/css';
// Modules CSS
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../../styles/Slider.scss';
import { useTranslation } from 'react-i18next';
import { RTL_LANGS } from '../../enums';
import { useEffect, useState } from 'react';
import i18next from 'i18next';

// Sample slide data
const slides = [
    {
        id: 1,
        image: '/manufacturing-3.png',
        title: 'Explore New Horizons',
        description: 'Discover breathtaking experiences with our premium services.',
    },
    {
        id: 2,
        image: '/digital-factory_2-2-1024x614.jpg',
        title: 'Innovative Solutions',
        description: 'Transform your ideas into reality with cutting-edge technology.',
    },
];

// Animation variants for slide content
const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

const SwiperSlider = () => {
    const { t } = useTranslation();
    const [language, setLanguage] = useState(i18next.language);
    const baseLang = language.split('-')[0];
    const isRtl = RTL_LANGS.includes(baseLang);

    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            setLanguage(lng);
        };
        i18next.on('languageChanged', handleLanguageChange);
        return () => {
            i18next.off('languageChanged', handleLanguageChange);
        };
    }, [isRtl]);

    return (
        <section className="slider-section" dir={isRtl ? 'rtl' : 'ltr'}>
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                // autoplay={{
                //     delay: 3000,
                //     disableOnInteraction: false,
                // }}
                navigation={true}
                pagination={{
                    clickable: true,
                }}
                loop={true}
                rtl={isRtl}
                className="swiper-container"
                breakpoints={{
                    768: {
                        navigation: false,
                    },
                }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="slide">
                            <img src={slide.image} alt={slide.title} className="slide-image" />
                            <div className='overlay'>
                                <motion.div
                                    className="slide-content"
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <h3 className="slide-title">{t(slide.title)}</h3>
                                    <p className="slide-description">{t(slide.description)}</p>
                                    <button className="slide-button">{t('Learn More')}</button>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default SwiperSlider;