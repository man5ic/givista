/**
 * Badge Display Component
 * 
 * Displays user badges with tooltip information.
 */

import { useState } from 'react';
import { BADGE_DEFINITIONS } from '../utils/badgeDefinitions';

interface BadgeDisplayProps {
  badges: string[];
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const BadgeDisplay = ({ badges, showTooltip = true, size = 'md' }: BadgeDisplayProps) => {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  if (!badges || badges.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {badges.map((badgeId) => {
        const badgeDef = BADGE_DEFINITIONS.find((b) => b.id === badgeId);
        if (!badgeDef) return null;

        return (
          <div
            key={badgeId}
            className="relative"
            onMouseEnter={() => showTooltip && setHoveredBadge(badgeId)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <span className={`${sizeClasses[size]} cursor-help`} title={showTooltip ? badgeDef.description : undefined}>
              {badgeDef.emoji} {badgeDef.name}
            </span>
            {showTooltip && hoveredBadge === badgeId && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10 whitespace-nowrap">
                {badgeDef.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;

