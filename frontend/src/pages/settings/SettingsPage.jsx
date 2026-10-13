import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

// ── Reusable section wrapper ──────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <section className="bg-[rgb(var(--color-bg-secondary))]/50 border border-[rgb(var(--color-border))] rounded-xl p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">{title}</h2>
        <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-[rgb(var(--color-text))] cursor-pointer">{label}</label>
        {description && <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
          checked ? 'bg-cyan-500' : 'bg-[rgb(var(--color-border))]'
        }`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}

// ── Select field ──────────────────────────────────────────────────────────────
function SelectField({ id, label, description, value, onChange, options }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-[rgb(var(--color-text))]">{label}</label>
        {description && <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">{description}</p>}
      </div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer min-w-[160px]"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { isDark, setLightTheme, setDarkTheme, resetToSystem } = useTheme();

  // Mock settings state
  // Modificamos el estado para que lea de localStorage al iniciar
  const [settings, setSettings] = useState(() => {
    const savedDepth = localStorage.getItem('forgeLink_canvasDepth') || '3';
    return {
      language: 'en',
      themeMode: isDark ? 'dark' : 'light',
      accentColor: 'cyan',
      canvasSnap: true,
      canvasGrid: true,
      canvasMinimap: false,
      autoSave: true,
      autoSaveInterval: '5',
      animateEdges: true,
      notifyEmail: true,
      notifyCollabJoin: true,
      notifyWeeklyDigest: false,
      notifySounds: false,
      profilePublic: false,
      shareAnalytics: false,
      showOnlineStatus: true,
      twoFactorAuth: false,
      canvasDepth: savedDepth, // <-- Ahora lee el valor guardado
    };
  });

  // Modificamos la función update para que guarde en localStorage si es la profundidad
  const update = (key) => (value) => {
    setSettings(s => ({ ...s, [key]: value }));
    if (key === 'canvasDepth') {
      localStorage.setItem('forgeLink_canvasDepth', value);
    }
  };

  const handleThemeChange = (mode) => {
    setSettings(s => ({ ...s, themeMode: mode }));
    if (mode === 'dark') setDarkTheme();
    else if (mode === 'light') setLightTheme();
    else resetToSystem();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[rgb(var(--color-text))]">{t('settings.header.title')}</h1>
                <p className="text-[rgb(var(--color-text-secondary))] mt-0.5">
                  {t('settings.header.description')}
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-6">

            {/* ── Profile ──────────────────────────────────────────── */}
            <Section title={t('settings.profile.title')} description={t('settings.profile.description')}>
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {user?.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-[rgb(var(--color-text))] truncate">{user?.user?.username || 'Usuario'}</p>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] truncate">{user?.user?.email || 'email@example.com'}</p>
                </div>
                <button type="button" className="px-4 py-2 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-text-secondary))]/30 transition-colors cursor-pointer">
                  {t('settings.profile.editButton')}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[rgb(var(--color-border))]">
                <div>
                  <label htmlFor="settings-displayname" className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">{t('settings.profile.displayName')}</label>
                  <input id="settings-displayname" type="text" defaultValue={user?.user?.username || ''} autoComplete="name" className="w-full px-3 py-2 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
                <div>
                  <label htmlFor="settings-bio" className="block text-xs font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">{t('settings.profile.bio')}</label>
                  <input id="settings-bio" type="text" placeholder={t('settings.profile.bioPlaceholder')} autoComplete="off" className="w-full px-3 py-2 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-secondary))]/40 focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
              </div>
            </Section>

            {/* ── Appearance ───────────────────────────────────────── */}
            <Section title={t('settings.appearance.title')} description={t('settings.appearance.description')}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[rgb(var(--color-text))]">{t('settings.appearance.theme.label')}</p>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">{t('settings.appearance.theme.description')}</p>
                </div>
                <div className="flex gap-1 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg p-1">
                  {[
                    { value: 'light', icon: '☀️', label: t('settings.appearance.theme.light') },
                    { value: 'dark', icon: '🌙', label: t('settings.appearance.theme.dark') },
                    { value: 'system', icon: '💻', label: t('settings.appearance.theme.system') },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleThemeChange(opt.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        settings.themeMode === opt.value
                          ? 'bg-cyan-500 text-white shadow-sm'
                          : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))]'
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <SelectField
             id="settings-language"
             label={t('settings.language.interfaceLanguage.label')}
             description={t('settings.language.interfaceLanguage.description')}
             value={i18n.language.split('-')[0]} // Tomamos el idioma actual, ignorando variaciones como 'es-AR'
             onChange={(newLang) => {
               update('language')(newLang);
               i18n.changeLanguage(newLang); // <-- ¡Esta línea hace el cambio instantáneo!
             }}
             options={[
               { value: 'en', label: t('settings.language.interfaceLanguage.english') },
               { value: 'es', label: t('settings.language.interfaceLanguage.spanish') },
               { value: 'pt', label: t('settings.language.interfaceLanguage.portuguese') },
               { value: 'fr', label: t('settings.language.interfaceLanguage.french') },
               { value: 'de', label: t('settings.language.interfaceLanguage.german') },
               { value: 'ja', label: t('settings.language.interfaceLanguage.japanese') },
               { value: 'ko', label: t('settings.language.interfaceLanguage.korean') },
               { value: 'zh', label: t('settings.language.interfaceLanguage.chinese') },
             ]}
           />

              <SelectField
                id="settings-font"
                label={t('settings.appearance.fontFamily.label')}
                description={t('settings.appearance.fontFamily.description')}
                value="outfit"
                onChange={() => {}}
                options={[
                  { value: 'outfit', label: t('settings.appearance.fontFamily.outfit') },
                  { value: 'inter', label: t('settings.appearance.fontFamily.inter') },
                  { value: 'jakarta', label: t('settings.appearance.fontFamily.jakarta') },
                  { value: 'mono', label: t('settings.appearance.fontFamily.mono') },
                ]}
              />

              <SelectField
                id="settings-density"
                label={t('settings.appearance.density.label')}
                description={t('settings.appearance.density.description')}
                value="comfortable"
                onChange={() => {}}
                options={[
                  { value: 'compact', label: t('settings.appearance.density.compact') },
                  { value: 'comfortable', label: t('settings.appearance.density.comfortable') },
                  { value: 'spacious', label: t('settings.appearance.density.spacious') },
                ]}
              />
            </Section>



            {/* ── Canvas & Editor ──────────────────────────────────── */}
            <Section title={t('settings.canvas.title')} description={t('settings.canvas.description')}>
              <Toggle
                id="settings-autosave"
                label={t('settings.canvas.autoSave.label')}
                description={t('settings.canvas.autoSave.description')}
                checked={settings.autoSave}
                onChange={update('autoSave')}
              />
              <SelectField
                id="settings-autosave-interval"
                label={t('settings.canvas.autoSaveInterval.label')}
                description={t('settings.canvas.autoSaveInterval.description')}
                value={settings.autoSaveInterval}
                onChange={update('autoSaveInterval')}
                options={[
                  { value: '2', label: t('settings.canvas.autoSaveInterval.every2s') },
                  { value: '5', label: t('settings.canvas.autoSaveInterval.every5s') },
                  { value: '10', label: t('settings.canvas.autoSaveInterval.every10s') },
                  { value: '30', label: t('settings.canvas.autoSaveInterval.every30s') },
                ]}
              />
              <Toggle
                id="settings-snap"
                label={t('settings.canvas.snapToGrid.label')}
                description={t('settings.canvas.snapToGrid.description')}
                checked={settings.canvasSnap}
                onChange={update('canvasSnap')}
              />
              <Toggle
                id="settings-grid"
                label={t('settings.canvas.showGrid.label')}
                description={t('settings.canvas.showGrid.description')}
                checked={settings.canvasGrid}
                onChange={update('canvasGrid')}
              />
              <Toggle
                id="settings-minimap"
                label={t('settings.canvas.showMinimap.label')}
                description={t('settings.canvas.showMinimap.description')}
                checked={settings.canvasMinimap}
                onChange={update('canvasMinimap')}
              />
              <Toggle
                id="settings-animate-edges"
                label={t('settings.canvas.animateEdges.label')}
                description={t('settings.canvas.animateEdges.description')}
                checked={settings.animateEdges}
                onChange={update('animateEdges')}
              />
              <SelectField
                id="settings-default-edge"
                label={t('settings.canvas.defaultEdgeType.label')}
                description={t('settings.canvas.defaultEdgeType.description')}
                value="bezier"
                onChange={() => {}}
                options={[
                  { value: 'bezier', label: t('settings.canvas.defaultEdgeType.bezier') },
                  { value: 'straight', label: t('settings.canvas.defaultEdgeType.straight') },
                  { value: 'step', label: t('settings.canvas.defaultEdgeType.step') },
                  { value: 'smoothstep', label: t('settings.canvas.defaultEdgeType.smoothStep') },
                ]}
              />
              <SelectField
                id="settings-canvas-depth"
                label={t('settings.canvas.canvasDepth.label')}
                description={t('settings.canvas.canvasDepth.description')}
                value={settings.canvasDepth}
                onChange={update('canvasDepth')}
                options={[
                  { value: '2', label: t('settings.canvas.canvasDepth.level2') },
                  { value: '3', label: t('settings.canvas.canvasDepth.level3') },
                  { value: '5', label: t('settings.canvas.canvasDepth.level5') },
                  { value: '-1', label: t('settings.canvas.canvasDepth.infinite') },
                ]}
              />
            </Section>

            {/* ── Notifications ────────────────────────────────────── */}
            <Section title={t('settings.notifications.title')} description={t('settings.notifications.description')}>
              <Toggle
                id="settings-notify-email"
                label={t('settings.notifications.emailNotifications.label')}
                description={t('settings.notifications.emailNotifications.description')}
                checked={settings.notifyEmail}
                onChange={update('notifyEmail')}
              />
              <Toggle
                id="settings-notify-collab"
                label={t('settings.notifications.collaboratorJoins.label')}
                description={t('settings.notifications.collaboratorJoins.description')}
                checked={settings.notifyCollabJoin}
                onChange={update('notifyCollabJoin')}
              />
              <Toggle
                id="settings-notify-digest"
                label={t('settings.notifications.weeklyDigest.label')}
                description={t('settings.notifications.weeklyDigest.description')}
                checked={settings.notifyWeeklyDigest}
                onChange={update('notifyWeeklyDigest')}
              />
              <Toggle
                id="settings-notify-sounds"
                label={t('settings.notifications.soundEffects.label')}
                description={t('settings.notifications.soundEffects.description')}
                checked={settings.notifySounds}
                onChange={update('notifySounds')}
              />
            </Section>

            {/* ── Privacy ──────────────────────────────────────────── */}
            <Section title={t('settings.privacy.title')} description={t('settings.privacy.description')}>
              <Toggle
                id="settings-profile-public"
                label={t('settings.privacy.publicProfile.label')}
                description={t('settings.privacy.publicProfile.description')}
                checked={settings.profilePublic}
                onChange={update('profilePublic')}
              />
              <Toggle
                id="settings-analytics"
                label={t('settings.privacy.usageAnalytics.label')}
                description={t('settings.privacy.usageAnalytics.description')}
                checked={settings.shareAnalytics}
                onChange={update('shareAnalytics')}
              />
              <Toggle
                id="settings-online"
                label={t('settings.privacy.showOnlineStatus.label')}
                description={t('settings.privacy.showOnlineStatus.description')}
                checked={settings.showOnlineStatus}
                onChange={update('showOnlineStatus')}
              />
              <Toggle
                id="settings-2fa"
                label={t('settings.privacy.twoFactorAuth.label')}
                description={t('settings.privacy.twoFactorAuth.description')}
                checked={settings.twoFactorAuth}
                onChange={update('twoFactorAuth')}
              />

              <div className="pt-3 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[rgb(var(--color-text))]">{t('settings.privacy.exportData.label')}</p>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">{t('settings.privacy.exportData.description')}</p>
                </div>
                <button type="button" className="px-4 py-2 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-text-secondary))]/30 transition-colors cursor-pointer">
                  {t('settings.privacy.exportData.button')}
                </button>
              </div>
            </Section>

            {/* ── Keyboard Shortcuts ───────────────────────────────── */}
            <Section title={t('settings.shortcuts.title')} description={t('settings.shortcuts.description')}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { action: t('settings.shortcuts.actions.undo'), shortcut: 'Ctrl + Z' },
                  { action: t('settings.shortcuts.actions.redo'), shortcut: 'Ctrl + Y' },
                  { action: t('settings.shortcuts.actions.save'), shortcut: 'Ctrl + S' },
                  { action: t('settings.shortcuts.actions.deleteNode'), shortcut: 'Backspace' },
                  { action: t('settings.shortcuts.actions.selectAll'), shortcut: 'Ctrl + A' },
                  { action: t('settings.shortcuts.actions.zoomIn'), shortcut: 'Ctrl + +' },
                  { action: t('settings.shortcuts.actions.zoomOut'), shortcut: 'Ctrl + -' },
                  { action: t('settings.shortcuts.actions.fitView'), shortcut: 'Ctrl + 0' },
                ].map(item => (
                  <div key={item.action} className="flex items-center justify-between bg-[rgb(var(--color-bg))]/50 border border-[rgb(var(--color-border))] rounded-lg px-3 py-2">
                    <span className="text-sm text-[rgb(var(--color-text))]">{item.action}</span>
                    <kbd className="px-2 py-0.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded text-[10px] font-mono text-[rgb(var(--color-text-secondary))]">
                      {item.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Danger Zone ──────────────────────────────────────── */}
            <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
                <p className="text-xs text-red-400/60 mt-0.5">Irreversible actions. Proceed with caution.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[rgb(var(--color-text))]">Delete All Projects</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Permanently remove all your projects and their data.</p>
                  </div>
                  <button type="button" className="px-4 py-2 rounded-lg border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                    Delete All
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-red-500/10">
                  <div>
                    <p className="text-sm font-medium text-[rgb(var(--color-text))]">Delete Account</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Permanently delete your account and all associated data.</p>
                  </div>
                  <button type="button" className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer">
                    Delete Account
                  </button>
                </div>
              </div>
            </section>

          </div>

          {/* Footer note */}
          <div className="mt-10 mb-8 text-center">
            <p className="text-xs text-[rgb(var(--color-text-secondary))]/50">
              {t('settings.footer.note')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

