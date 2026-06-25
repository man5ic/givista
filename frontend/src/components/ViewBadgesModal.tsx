/**
 * View Badges Modal Component
 * 
 * Modal that displays all available badges and how to earn them.
 */

import { BADGE_DEFINITIONS } from '../utils/badgeDefinitions';
import BadgeDisplay from './BadgeDisplay';

interface ViewBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBadges: string[];
}

const ViewBadgesModal = ({ isOpen, onClose, userBadges }: ViewBadgesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Badges & Achievements
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition text-2xl"
            >
              ×
            </button>
          </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Earn badges by completing donations and helping your community. Each badge represents a milestone in your giving journey!
                  </p>
                  
                  {userBadges && userBadges.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-green-900 mb-2">Your Badges:</h4>
                      <BadgeDisplay badges={userBadges} showTooltip={false} size="lg" />
                    </div>
                  )}
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {BADGE_DEFINITIONS.map((badge) => {
                    const isEarned = userBadges?.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`border rounded-lg p-4 ${
                          isEarned
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <span className="text-3xl">{badge.emoji}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                <strong>Requirement:</strong> {badge.requirement}
                              </p>
                            </div>
                          </div>
                          {isEarned && (
                            <span className="text-green-600 font-semibold text-sm">✓ Earned</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBadgesModal;

