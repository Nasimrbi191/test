import { useRef } from 'react';
import {  motion, useInView } from 'framer-motion';
import '../../styles/Services.scss';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Mock Data
const services = [
    {
        id: 1,
        title: 'Web Development',
        description: 'Build modern, responsive websites with cutting-edge technologies.',
        icon: '🌐',
    },
    {
        id: 2,
        title: 'UI/UX Design',
        description: 'Create intuitive and visually stunning user experiences.',
        icon: '🎨',
    },
    {
        id: 3,
        title: 'Mobile Apps',
        description: 'Develop cross-platform mobile applications with seamless performance.',
        icon: '📱',
    },
    {
        id: 4,
        title: 'Cloud Solutions',
        description: 'Leverage scalable cloud infrastructure for your business needs.',
        icon: '☁️',
    },
];


const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: { duration: 0.5, ease: "easeOut" as const }, 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", duration: 0.5, ease: "easeOut" as const },
  },
};


const ServiceCard = ({ service }: { service: typeof services[number] }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false, // Re-trigger animations on every scroll
        margin: '-10px 0px', // Trigger 50px before card enters viewport
    });
    const { t } = useTranslation();
    return (
        <motion.div
            ref={ref}
            className="service-card"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover="hover"
        >
            <motion.div
                className="service-icon"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                {service.icon}
            </motion.div>
            <h3 className="service-title">{t(service.title)}</h3>
            <p className="service-description">{t(service.description)}</p>
        </motion.div>
    );
};

const Services = () => {
    const { t } = useTranslation();
    return (
        <section className="services-section">
            <Container maxWidth="lg" className="services-container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {t('our Services')}
                </motion.h2>
                <div className="services-grid">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Services;