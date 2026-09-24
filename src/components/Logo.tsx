import { Link } from 'react-router-dom';
import logoUrl from '../assets/tuba-foundation-logo.jpg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  whiteText?: boolean;
  showText?: boolean;
}

export default function Logo({
  className = '',
  size = 'md',
  whiteText = false,
  showText = true,
}: LogoProps) {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-tight',
    md: 'text-base sm:text-lg font-bold tracking-tight',
    lg: 'text-xl sm:text-2xl font-bold tracking-tight',
    xl: 'text-2xl sm:text-3xl font-bold tracking-tight',
  };

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Official NGO Emblem */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-full bg-white flex items-center justify-center shadow-xs border border-gray-200/80 group-hover:scale-105 transition-transform duration-200 overflow-hidden ring-2 ring-emerald-600/20`}
      >
        <img
          src={logoUrl}
          alt="Tuba Foundation Gokak Official Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${titleSizes[size]} font-extrabold uppercase leading-tight ${
              whiteText ? 'text-white' : 'text-gray-950 group-hover:text-[#0e6245] transition-colors'
            }`}
          >
            TUBA FOUNDATION GOKAK
          </span>
          <span
            className={`${subtitleSizes[size]} uppercase tracking-wider font-medium ${
              whiteText ? 'text-emerald-200/90' : 'text-emerald-800'
            }`}
          >
            Education & Skill Development
          </span>
        </div>
      )}
    </Link>
  );
}
