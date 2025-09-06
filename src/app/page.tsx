"use client";

export default function Home() {
  return (
    <div className="">
      <div className="relative m-10 min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/landing-bg.jpeg')",
            filter: "brightness(0.5)",
          }}
        />

        <div className="absolute top-20 left-1/2 -translate-x-1/2 transform">
          <nav className="">
            <ul className="flex space-x-8 font-medium text-white">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Gallery
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
