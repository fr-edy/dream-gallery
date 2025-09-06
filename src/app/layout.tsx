import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = localFont({
  src: [
    {
      path: "../../public/Instrument_Serif/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Instrument_Serif/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dream Gallery - Transform Your Dreams Into Visual Stories",
  description:
    "Discover a curated collection of dreamlike artworks that blur the boundaries between imagination and reality. Join our community of dreamers, artists, and visionaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* External styles and scripts should be imported in a different way for Next.js */}
        <link rel="stylesheet" href="/liqglass/glass.css" />
        <script 
          src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
          async
        />
        <script src="/liqglass/container.js" />
        <script src="/liqglass/button.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced glass parameters for more realistic glass effect
              window.glassControls = {
                edgeIntensity: 0.01,      // Enhanced edge refraction (was 0.01)
                rimIntensity: 0.05,        // Stronger rim lighting (was 0.05)
                baseIntensity: 0.01,      // Subtle center distortion (was 0.01)
                edgeDistance: 0.15,        // Refined edge falloff (was 0.15)
                rimDistance: 0.4,          // Extended rim effect (was 0.8)
                baseDistance: 0.1,        // Smooth base falloff (was 0.1)
                cornerBoost: 0.02,        // Enhanced corner effects (was 0.02)
                rippleEffect: 0.1,         // Subtle surface texture (was 0.1)
                blurRadius: 5,           // Optimal blur for glass (was 2.0/5.0)
                tintOpacity: 0.2          // Subtle tint overlay (was 0.2)
              };

              // Function to update all glass instances with new parameters
              function updateAllGlassInstances() {
                if (typeof Container !== 'undefined' && Container.instances) {
                  Container.instances.forEach(instance => {
                    if (instance.gl_refs && instance.gl_refs.gl) {
                      const gl = instance.gl_refs.gl;
                      const controls = window.glassControls;
                      
                      if (instance.gl_refs.edgeIntensityLoc) 
                        gl.uniform1f(instance.gl_refs.edgeIntensityLoc, controls.edgeIntensity);
                      if (instance.gl_refs.rimIntensityLoc) 
                        gl.uniform1f(instance.gl_refs.rimIntensityLoc, controls.rimIntensity);
                      if (instance.gl_refs.baseIntensityLoc) 
                        gl.uniform1f(instance.gl_refs.baseIntensityLoc, controls.baseIntensity);
                      if (instance.gl_refs.edgeDistanceLoc) 
                        gl.uniform1f(instance.gl_refs.edgeDistanceLoc, controls.edgeDistance);
                      if (instance.gl_refs.rimDistanceLoc) 
                        gl.uniform1f(instance.gl_refs.rimDistanceLoc, controls.rimDistance);
                      if (instance.gl_refs.baseDistanceLoc) 
                        gl.uniform1f(instance.gl_refs.baseDistanceLoc, controls.baseDistance);
                      if (instance.gl_refs.cornerBoostLoc) 
                        gl.uniform1f(instance.gl_refs.cornerBoostLoc, controls.cornerBoost);
                      if (instance.gl_refs.rippleEffectLoc) 
                        gl.uniform1f(instance.gl_refs.rippleEffectLoc, controls.rippleEffect);
                      if (instance.gl_refs.blurRadiusLoc) 
                        gl.uniform1f(instance.gl_refs.blurRadiusLoc, controls.blurRadius);
                        
                      if (instance.render) instance.render();
                    }
                  });
                }
              }

              // Apply enhanced parameters after a short delay to ensure classes are loaded
              setTimeout(() => {
                updateAllGlassInstances();
              }, 100);
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
