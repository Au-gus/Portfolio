import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Resume } from "@/components/sections/Resume";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Skills } from "@/components/sections/Skills";
import { ShaderBgWrapper } from "@/components/background/ShaderBgWrapper";
import { ParticlesBg } from "@/components/background/ParticlesBg";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ShaderBgWrapper />
      <ParticlesBg />
      <section id="home"><Hero /></section>
      <section id="about"><About /></section>
      <section id="timeline"><Resume /></section>
      <section id="projects"><Projects /></section>
      <section id="skills"><Skills /></section>
      <section id="contact"><Contact /></section>
      <Footer />
    </main>
  );
}

