import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Box } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTranslation } from "react-i18next";



// Framer Motion variants for chat bubble animations
const bubbleVariants = (index) => ({
  hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100, scale: 0.8 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
});

// Custom Navigation Buttons Component
const NavigationButtons = () => {
  const swiper = useSwiper();
  return (
    <>
      <button
        onClick={() => swiper.slidePrev()}
        style={{
          position: "absolute",
          top: "50%",
          left: "-60px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
      >
        <ArrowBackIosNewIcon style={{ fontSize: "24px" }} />
      </button>
      <button
        onClick={() => swiper.slideNext()}
        style={{
          position: "absolute",
          top: "50%",
          right: "-60px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
      >
        <ArrowForwardIosIcon style={{ fontSize: "24px" }} />
      </button>
    </>
  );
};

export default function ChatTestimonialSlider() {
  const { t } = useTranslation();
  const testimonials = [
    {
      id: 1,
      name: `${t("Jane Doe")}`,
      role: `${t("Product Manager")}`,
      quote: `${t("This service transformed our workflow with its intuitive design and exceptional support.")}`,
      image: "/profile.webp",
    },
    {
      id: 2,
      name: `${t("John Smith")}`,
      role: `${t("Software Engineer")}`,
      quote: `${t("The team delivered beyond expectations, providing innovative solutions tailored to our needs.")}`,
      image: "/selfie-ideas.webp",
    },
    {
      id: 3,
      name: `${t("Emily Brown")}`,
      role: `${t("Marketing Director")}`,
      quote: `${t("An outstanding experience! The platform is user-friendly and visually stunning.")}`,
      image: "/tips.webp",
    },
    {
      id: 4,
      name: `${t("Alex Johnson")}`,
      role: `${t("Sales Lead")}`,
      quote: `${t("Highly recommend! Excellent quality and attention to detail.")}`,
      image: "/tips.webp",
    },
  ];
  // Split testimonials into pairs
  const slides = [];
  for (let i = 0; i < testimonials.length; i += 2) {
    slides.push(testimonials.slice(i, i + 2));
  }


  return (
    <section style={{ background: "#0f172a", color: "#fff", padding: "80px 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "50px", fontSize: "2rem", fontWeight: "bold" }}>
        {t("What Our Clients Say")}
      </h2>

      <Box sx={{ position: "relative", maxWidth: "100%", width: "1000px", margin: "0 auto" }}>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          spaceBetween={10}
          dir="ltr"
        >
          {slides.map((pair, idx) => (
            <SwiperSlide key={idx}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
                {pair.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.5 }}
                    variants={bubbleVariants(i)}
                    style={{
                      background: i % 2 === 0 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.15)",
                      borderRadius: "20px",
                      padding: "20px",
                      maxWidth: "45%",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                    }}
                  >
                    <p style={{ fontSize: "1.05rem", lineHeight: 1.5, marginBottom: "15px" }}>"{t.quote}"</p>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={t.image}
                        alt={t.name}
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: "50%",
                          marginRight: 10,
                          border: "2px solid rgba(255,255,255,0.3)",
                        }}
                      />
                      <Box>
                        <h4 style={{ margin: 0 }}>{t.name}</h4>
                        <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0 }}>{t.role}</p>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </SwiperSlide>
          ))}
          <NavigationButtons />
        </Swiper>
      </Box>

      <style>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255,255,255,0.4);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #06b6d4;
          width: 30px;
          border-radius: 20px;
        }
      `}</style>
    </section>
  );
}