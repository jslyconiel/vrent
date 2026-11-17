import React from 'react';

interface RoomIllustrationProps {
  theme: string;
  className?: string;
}

export const RoomIllustration: React.FC<RoomIllustrationProps> = ({ theme, className = '' }) => {
  switch (theme) {
    case 'sunrise':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="180" fill="#f0ebe1" />
          {/* Gentle sun */}
          <circle cx="280" cy="55" r="32" fill="#ffd166" opacity="0.9" />
          <path d="M 0 145 Q 120 140 240 145 T 400 145 L 400 180 L 0 180 Z" fill="#d9cebd" />
          {/* Main student house */}
          <rect x="90" y="70" width="130" height="80" rx="4" fill="#2a6f68" />
          {/* Roof */}
          <polygon points="75,70 155,25 235,70" fill="#e05d26" />
          {/* Window */}
          <rect x="110" y="85" width="32" height="32" rx="3" fill="#ffeaa7" />
          <line x1="126" y1="85" x2="126" y2="117" stroke="#2a6f68" strokeWidth="2" />
          <line x1="110" y1="101" x2="142" y2="101" stroke="#2a6f68" strokeWidth="2" />
          {/* Door */}
          <rect x="160" y="95" width="28" height="55" rx="3" fill="#1b4944" />
          <circle cx="166" cy="122" r="2.5" fill="#ffd166" />
          {/* Cute trees */}
          <circle cx="255" cy="115" r="22" fill="#40916c" />
          <rect x="252" y="130" width="6" height="24" fill="#6f4e37" />
          <circle cx="60" cy="122" r="16" fill="#52b788" />
          <rect x="58" y="134" width="4" height="18" fill="#6f4e37" />
        </svg>
      );

    case 'cozy':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="180" fill="#eed9a4" />
          {/* Ground */}
          <rect x="0" y="145" width="400" height="35" fill="#dbc084" />
          {/* Modern flat-roof studio */}
          <rect x="110" y="60" width="160" height="88" rx="5" fill="#354f52" />
          {/* Overhang */}
          <rect x="100" y="55" width="180" height="8" rx="2" fill="#2f3e46" />
          {/* Big architectural studio window */}
          <rect x="128" y="75" width="65" height="55" rx="4" fill="#ffd166" />
          <line x1="160" y1="75" x2="160" y2="130" stroke="#354f52" strokeWidth="2" />
          {/* Indoor plant silhouette in window */}
          <ellipse cx="145" cy="122" rx="8" ry="4" fill="#2f3e46" />
          <circle cx="145" cy="112" r="7" fill="#52b788" />
          {/* Studio Door */}
          <rect x="215" y="80" width="35" height="68" rx="2" fill="#52796f" />
          <circle cx="222" cy="114" r="2.5" fill="#ffd166" />
          {/* Outside cactus/pot plant */}
          <rect x="290" y="125" width="18" height="22" rx="2" fill="#e05d26" />
          <ellipse cx="299" cy="112" rx="7" ry="16" fill="#2d6a4f" />
        </svg>
      );

    case 'greenview':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Twilight / Night dorm setting */}
          <rect width="400" height="180" fill="#2b2d42" />
          {/* Stars */}
          <circle cx="70" cy="35" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="150" cy="25" r="2" fill="#ffd166" opacity="0.9" />
          <circle cx="280" cy="30" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="340" cy="50" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="45" cy="70" r="1.5" fill="#ffffff" opacity="0.6" />
          {/* Ground */}
          <rect x="0" y="148" width="400" height="32" fill="#1e202f" />
          {/* 3-Storey Dormitory Building */}
          <rect x="140" y="38" width="115" height="112" rx="4" fill="#5c4d7d" />
          {/* Dorm windows row 1 */}
          <rect x="155" y="50" width="18" height="20" rx="2" fill="#ffeaa7" />
          <rect x="188" y="50" width="18" height="20" rx="2" fill="#ffeaa7" />
          <rect x="222" y="50" width="18" height="20" rx="2" fill="#3a3052" />
          {/* Dorm windows row 2 */}
          <rect x="155" y="80" width="18" height="20" rx="2" fill="#ffeaa7" />
          <rect x="188" y="80" width="18" height="20" rx="2" fill="#ffeaa7" />
          <rect x="222" y="80" width="18" height="20" rx="2" fill="#ffeaa7" />
          {/* Entrance */}
          <rect x="185" y="115" width="25" height="35" rx="3" fill="#ffeaa7" />
          {/* Street lamp */}
          <line x1="285" y1="148" x2="285" y2="85" stroke="#8d99ae" strokeWidth="3" />
          <circle cx="285" cy="85" r="7" fill="#ffd166" />
          <circle cx="285" cy="85" r="16" fill="#ffd166" opacity="0.25" />
        </svg>
      );

    case 'maple':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="180" fill="#e8d8c8" />
          <rect x="0" y="145" width="400" height="35" fill="#cbbba8" />
          {/* Private House */}
          <polygon points="120,70 190,30 260,70" fill="#4a5759" />
          <rect x="135" y="70" width="110" height="78" rx="3" fill="#dedbd2" />
          {/* Windows */}
          <rect x="150" y="85" width="30" height="32" rx="2" fill="#f5cb5c" />
          <line x1="165" y1="85" x2="165" y2="117" stroke="#4a5759" strokeWidth="1.5" />
          <line x1="150" y1="101" x2="180" y2="101" stroke="#4a5759" strokeWidth="1.5" />
          {/* Modern Door */}
          <rect x="200" y="92" width="28" height="56" rx="2" fill="#b07d62" />
          {/* Porch light */}
          <circle cx="195" cy="98" r="3" fill="#ffd166" />
          <circle cx="195" cy="98" r="8" fill="#ffd166" opacity="0.3" />
          {/* Maple / Autumn foliage tree */}
          <circle cx="85" cy="115" r="26" fill="#e05d26" opacity="0.9" />
          <circle cx="95" cy="100" r="20" fill="#ea7342" />
          <rect x="83" y="128" width="8" height="22" fill="#582f0e" />
        </svg>
      );

    case 'bayanihan':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="180" fill="#dce6e7" />
          <rect x="0" y="144" width="400" height="36" fill="#bccdce" />
          {/* Extended bungalow */}
          <polygon points="80,75 160,35 240,75" fill="#386641" />
          <polygon points="210,75 270,45 330,75" fill="#6a994e" />
          <rect x="95" y="75" width="220" height="72" rx="3" fill="#f2e8cf" />
          {/* Windows */}
          <rect x="120" y="90" width="36" height="28" rx="2" fill="#a7c957" />
          <rect x="175" y="90" width="36" height="28" rx="2" fill="#ffeaa7" />
          <rect x="240" y="90" width="28" height="57" rx="2" fill="#bc4749" />
          {/* Clothesline / community feel */}
          <line x1="40" y1="110" x2="85" y2="115" stroke="#6c757d" strokeWidth="1.5" />
          <rect x="50" y="112" width="12" height="16" fill="#e05d26" rx="1" />
          <rect x="66" y="114" width="10" height="14" fill="#386641" rx="1" />
        </svg>
      );

    case 'harbor':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="180" fill="#d4eaf7" />
          {/* Water waves */}
          <path d="M 0 148 Q 40 140 80 148 T 160 148 T 240 148 T 320 148 T 400 148 L 400 180 L 0 180 Z" fill="#0077b6" />
          <path d="M 0 160 Q 50 154 100 160 T 200 160 T 300 160 T 400 160 L 400 180 L 0 180 Z" fill="#023e8a" />
          {/* Pier / coastal building */}
          <rect x="120" y="65" width="130" height="85" rx="3" fill="#0096c7" />
          <polygon points="105,65 185,25 265,65" fill="#03045e" />
          {/* Lighted windows */}
          <rect x="140" y="80" width="26" height="26" rx="2" fill="#ffd166" />
          <rect x="185" y="80" width="26" height="26" rx="2" fill="#ffd166" />
          {/* Small boat silhouette */}
          <polygon points="280,148 315,148 322,142 275,142" fill="#48cae4" />
          <line x1="298" y1="142" x2="298" y2="120" stroke="#03045e" strokeWidth="2" />
          <polygon points="298,122 312,132 298,136" fill="#ffffff" />
        </svg>
      );

    case 'hillside':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="180" fill="#d8e2dc" />
          {/* Rolling green hills */}
          <circle cx="100" cy="220" r="140" fill="#95d5b2" />
          <circle cx="320" cy="230" r="160" fill="#74c69d" />
          {/* Hillside cabin */}
          <polygon points="150,75 220,38 290,75" fill="#40916c" />
          <rect x="165" y="75" width="110" height="78" rx="3" fill="#f8edeb" />
          {/* Warm windows */}
          <rect x="180" y="90" width="32" height="30" rx="2" fill="#ffeaa7" />
          <rect x="228" y="96" width="28" height="57" rx="2" fill="#52b788" />
          {/* Mountain pine trees */}
          <polygon points="90,135 105,95 120,135" fill="#2d6a4f" />
          <polygon points="65,140 78,110 90,140" fill="#1b4332" />
        </svg>
      );

    case 'capitol':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="180" fill="#ede0d4" />
          <rect x="0" y="145" width="400" height="35" fill="#ddb892" />
          {/* Classic stately building */}
          <rect x="110" y="52" width="180" height="95" rx="3" fill="#7f5539" />
          {/* Front pediment / columns */}
          <polygon points="95,52 200,18 305,52" fill="#b08968" />
          <rect x="135" y="70" width="22" height="32" rx="2" fill="#f5ebe0" />
          <rect x="175" y="70" width="22" height="32" rx="2" fill="#ffd166" />
          <rect x="215" y="70" width="22" height="32" rx="2" fill="#f5ebe0" />
          <rect x="255" y="70" width="22" height="32" rx="2" fill="#ffd166" />
          {/* Grand arched entrance */}
          <path d="M 185 147 L 185 118 Q 200 106 215 118 L 215 147 Z" fill="#e6ccb2" />
        </svg>
      );

    case 'falls':
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Plum / purple modern student dorm */}
          <rect width="400" height="180" fill="#3d314a" />
          <rect x="0" y="146" width="400" height="34" fill="#292033" />
          {/* Multi-story tower dorm */}
          <rect x="135" y="32" width="130" height="116" rx="4" fill="#68567c" />
          {/* Roof solar / AC unit */}
          <rect x="155" y="24" width="40" height="8" rx="1" fill="#4a3e59" />
          {/* Glowing student study windows */}
          <rect x="150" y="44" width="22" height="22" rx="2" fill="#ffd166" />
          <rect x="188" y="44" width="22" height="22" rx="2" fill="#ffeaa7" />
          <rect x="226" y="44" width="22" height="22" rx="2" fill="#ffd166" />
          <rect x="150" y="78" width="22" height="22" rx="2" fill="#ffd166" />
          <rect x="188" y="78" width="22" height="22" rx="2" fill="#3d314a" />
          <rect x="226" y="78" width="22" height="22" rx="2" fill="#ffd166" />
          {/* Ground entrance with awning */}
          <polygon points="175,116 225,116 230,122 170,122" fill="#e05d26" />
          <rect x="185" y="122" width="30" height="26" fill="#ffeaa7" />
        </svg>
      );

    case 'loft':
    default:
      return (
        <svg
          viewBox="0 0 400 180"
          className={`w-full h-full object-cover ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="400" height="180" fill="#e9c46a" />
          <rect x="0" y="145" width="400" height="35" fill="#d4a373" />
          {/* Modern urban loft building */}
          <rect x="115" y="45" width="165" height="102" rx="4" fill="#264653" />
          {/* Large industrial loft windows with black grilles */}
          <rect x="135" y="60" width="55" height="70" rx="2" fill="#f4a261" />
          <line x1="162" y1="60" x2="162" y2="130" stroke="#264653" strokeWidth="2" />
          <line x1="135" y1="95" x2="190" y2="95" stroke="#264653" strokeWidth="2" />
          {/* Upper mezzanine window */}
          <rect x="205" y="60" width="55" height="32" rx="2" fill="#e76f51" />
          <line x1="232" y1="60" x2="232" y2="92" stroke="#264653" strokeWidth="2" />
          {/* Modern ground door */}
          <rect x="215" y="102" width="35" height="45" rx="2" fill="#e9c46a" />
        </svg>
      );
  }
};
