import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-gray-800/80">
          {/* Brand & About Us */}
          <div className="md:col-span-5 space-y-4">
            <Logo whiteText size="md" />
            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                About Us
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                Tuba Foundation, Gokak is dedicated to fostering community upliftment and self-reliance through accessible vocational education, computer training, tailoring, and skill development programs.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Our Mission
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              To empower individuals, youth, and women through quality education, practical vocational skills, computer literacy, and ethical development, fostering self-reliance and community well-being in Gokak.
            </p>
          </div>

          {/* Vision */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Our Vision
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              An empowered, educated, and self-reliant community where every individual has access to knowledge, dignified livelihoods, and holistic skill development.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-300 uppercase tracking-wider">TUBA FOUNDATION GOKAK</span>
            <span>•</span>
            <span>Gokak, Karnataka</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© {currentYear} TUBA FOUNDATION GOKAK. All rights reserved.</span>
            <span>•</span>
            <Link
              to="/admin"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
