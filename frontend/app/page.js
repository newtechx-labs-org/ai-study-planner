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
          "radial-gradient(1200px 700px at 0% -18%, rgba(14,165,233,0.2), transparent 58%), radial-gradient(980px 620px at 100% 0%, rgba(16,185,129,0.16), transparent 60%), linear-gradient(180deg, #F2FAFF 0%, #F8FAFC 44%, #FFFFFF 100%)",
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
