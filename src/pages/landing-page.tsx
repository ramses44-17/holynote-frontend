import { Link, useNavigate } from "react-router"; // Correction de l'import
import { Button } from "@/components/ui/button";
import { Notebook, Search } from "lucide-react";
import { JSX, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate()
 useEffect(() => {
    if (user) {
      navigate("/notes");
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#3a3a3a] text-white">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-red-700">Remember</span> Every Sermon{" "}
            <span className="text-red-700">Effortlessly</span> with HolyNotes
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl px-6 md:px-3">
            Keep your sermon notes organized, searchable, and always within
            reach because every message matters.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-900/50 py-16 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                icon={<Notebook className="w-12 h-12 mb-4" />}
                title="Structured Note-Taking"
                description="Organize your sermon notes in a simple, structured way."
              />
              <FeatureCard
                icon={<Search className="w-12 h-12 mb-4" />}
                title="Powerful Search"
                description="Find your notes quickly and easily with a keyword search."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 HolyNotes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// FeatureCard Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800/70 p-6 rounded-lg text-center backdrop-blur-sm">
      <div className="flex justify-center">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
