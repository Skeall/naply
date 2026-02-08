import React, { useState } from 'react';
import { useAppStore } from '../app/store';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { clearAllData } from '../utils/storage';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const [clearDataConfirm, setClearDataConfirm] = useState(false);

  const handleThemeToggle = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const handleCoffeeDoseChange = (dose: number) => {
    updateSettings({ coffeeDoseMg: dose });
  };

  const handleClearData = () => {
    clearAllData();
    window.location.reload(); // Reload to reset store
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Réglages</h1>
          <p className="text-gray-400 text-sm">
            Personnalisez votre expérience
          </p>
        </div>

        {/* Theme Setting */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-4">Apparence</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Mode sombre</span>
            <button
              onClick={handleThemeToggle}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Coffee Dose Setting */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-4">Coffee Nap</h2>
          <div className="space-y-3">
            <div className="text-gray-300 text-sm">
              Dose de caféine par défaut (mg)
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="200"
                step="25"
                value={settings.coffeeDoseMg}
                onChange={(e) => handleCoffeeDoseChange(Number(e.target.value))}
                className="slider flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-medium w-12 text-right">
                {settings.coffeeDoseMg}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              50mg = espresso, 100mg = café standard, 200mg = dose forte
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-4">Gestion des données</h2>
          <div className="space-y-4">
            <div className="text-sm text-gray-300">
              Vos données sont stockées localement sur cet appareil.
            </div>
            <button
              onClick={() => setClearDataConfirm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Tout effacer
            </button>
            <div className="text-xs text-gray-500">
              Cette action supprimera définitivement toutes vos sessions et réglages.
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-4">À propos</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <div>NAP TRACKER v1.0.0</div>
            <div>Application PWA de tracking de siestes</div>
            <div className="text-xs text-gray-500 mt-2">
              Conçue pour vous aider à trouver votre format de sieste optimal
            </div>
          </div>
        </div>

        {/* Clear Data Confirmation Dialog */}
        <ConfirmDialog
          isOpen={clearDataConfirm}
          title="Tout effacer"
          message="Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action ne peut pas être annulée et effacera toutes vos sessions et réglages."
          confirmText="Tout effacer"
          cancelText="Annuler"
          onConfirm={handleClearData}
          onCancel={() => setClearDataConfirm(false)}
          type="danger"
        />
      </div>
    </div>
  );
};
