import logo from "./assets/herbalin_logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-[#1B5E44] py-12 px-6 text-center rounded-t-[60px]">
      <img
        src={logo}
        alt="Herbalin Logo"
        className="h-12 mx-auto mb-4"
      />
      <p className="text-[14px] font-bold uppercase tracking-[0.3em] opacity-80">
        © 2026 AI Skin Scanner | Herbalin
      </p>

    </footer>
  );
}