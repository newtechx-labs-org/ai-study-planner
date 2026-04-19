"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";

import CTASection from "@/app/components/landing/CTASection";
import FeaturesSection from "@/app/components/landing/FeaturesSection";
import HeroSection from "@/app/components/landing/HeroSection";
import HowItWorksSection from "@/app/components/landing/HowItWorksSection";
import LandingFooter from "@/app/components/landing/LandingFooter";
import LandingNavbar from "@/app/components/landing/LandingNavbar";
import PreviewSection from "@/app/components/landing/PreviewSection";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user, router]);

  return (
    <Box
      className={jakarta.className}
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(1200px 700px at 5% -10%, rgba(79,70,229,0.22), transparent 55%), radial-gradient(900px 560px at 95% 0%, rgba(6,182,212,0.18), transparent 60%), linear-gradient(180deg, #F8FAFF 0%, #F8FAFC 45%, #FFFFFF 100%)",
      }}
    >
      <LandingNavbar
        onLogin={() => router.push("/signin")}
        onRegister={() => router.push("/signup")}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box className={sora.className}>
          <HeroSection
            onLogin={() => router.push("/signin")}
            onRegister={() => router.push("/signup")}
          />
        </Box>
      </Container>

      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <CTASection onRegister={() => router.push("/signup")} />
      <LandingFooter />
    </Box>
  );
}
