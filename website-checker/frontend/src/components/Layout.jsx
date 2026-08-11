import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0b0a]">
      <Navbar />
      {children}
    </div>
  );
}
