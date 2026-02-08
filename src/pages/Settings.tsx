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
    <div className="min-h-screen pb-32">
      <div className="max-w-sm mx-auto px-6 pt-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="h1">Réglages</h1>
          <p className="caption">Personnalisez votre expérience</p>
        </div>

        {/* Theme Setting */}
        <div className="glass-card-raised p-6">
          <h2 className="h2 mb-4">Apparence</h2>
          <div className="flex items-center justify-between">
            <span className="body text-secondary">Mode sombre</span>
            <button
              onClick={handleThemeToggle}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200
                ${settings.theme === 'dark' ? 'bg-primary' : 'bg-surface-raised border border-border'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 shadow-sm
                  ${settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Coffee Dose Setting */}
        <div className="glass-card-raised p-6">
          <h2 className="h2 mb-4">Coffee Nap</h2>
          <div className="space-y-4">
            <div className="body text-secondary">
              Dose de caféine par défaut (mg)
            </div>
            <div className="slider-premium">
              <div className="slider-track" />
              <div 
                className="slider-fill" 
                style={{ width: `${(settings.coffeeDoseMg - 50) / 150 * 100}%` }}
              />
              <input
                type="range"
                min="50"
                max="200"
                step="25"
                value={settings.coffeeDoseMg}
                onChange={(e) => handleCoffeeDoseChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ padding: 0, margin: 0 }}
              />
            </div>
            <div className="flex justify-between caption text-secondary">
              <span>50mg</span>
              <span className="body text-primary font-medium">{settings.coffeeDoseMg}mg</span>
              <span>200mg</span>
            </div>
            <div className="caption text-secondary">
              50mg = espresso, 100mg = café standard, 200mg = dose forte
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-card-raised p-6">
          <h2 className="h2 mb-4">Gestion des données</h2>
          <div className="space-y-4">
            <div className="body text-secondary">
              Vos données sont stockées localement sur cet appareil.
            </div>
            <button
              onClick={() => setClearDataConfirm(true)}
              className="btn-cta w-full"
            >
              Tout effacer
            </button>
            <div className="caption text-secondary">
              Cette action supprimera définitivement toutes vos sessions et réglages.
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-card-raised p-6">
          <h2 className="h2 mb-4">À propos</h2>
          <div className="space-y-2 body text-secondary">
            <div>NAPLY v1.0.0</div>
            <div>Application PWA de tracking de siestes</div>
            <div className="caption text-secondary mt-2">
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
