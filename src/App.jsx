import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext.jsx';
import { GameLayout } from './components/layout/GameLayout.jsx';
import { ECILayout } from './components/layout/ECILayout.jsx';
import { CourtLayout } from './components/layout/CourtLayout.jsx';
import { AdminLayout } from './components/layout/AdminLayout.jsx';
import { LoginPage } from './components/auth/LoginPage.jsx';
import { MainGamingDashboard } from './components/dashboard/MainGamingDashboard.jsx';
import { CampaignCenterPage } from './components/pages/CampaignCenterPage.jsx';
import { StateElectionsHub } from './components/elections/StateElectionsHub.jsx';
import { ParliamentFloorPage } from './components/pages/ParliamentFloorPage.jsx';
import { GovernmentCabinetPage } from './components/pages/GovernmentCabinetPage.jsx';
import { PartyHQPage } from './components/pages/PartyHQPage.jsx';
import { AlliancesHubPage } from './components/pages/AlliancesHubPage.jsx';
import { MarketEconomyPage } from './components/pages/MarketEconomyPage.jsx';
import { ResultsDashboard } from './components/results/ResultsDashboard.jsx';
import { PoliticalStorePage } from './components/pages/PoliticalStorePage.jsx';
import { PlayerMessagingConsole } from './components/messaging/PlayerMessagingConsole.jsx';
import { BusinessEmpirePage } from './components/pages/BusinessEmpirePage.jsx';
import { TwitterXFeedPage } from './components/pages/TwitterXFeedPage.jsx';

import { PoliticianDashboard } from './components/politician/PoliticianDashboard.jsx';
import { PresidentGovernorDashboard } from './components/president/PresidentGovernorDashboard.jsx';
import { ECIDashboard } from './components/eci/ECIDashboard.jsx';
import { JudgeDashboard } from './components/judge/JudgeDashboard.jsx';
import { MediaDashboard } from './components/media/MediaDashboard.jsx';
import { AdminDashboard } from './components/admin/AdminDashboard.jsx';

const MainAppContent = () => {
  const { role, isLoggedIn } = useGame();
  const [activeTab, setActiveTab] = useState('home');
  const [isNewPartyModalOpen, setIsNewPartyModalOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // Render dedicated role layouts for ECI, Court/Judge, and Admin
  if (role === 'eci') {
    return <ECILayout />;
  }

  if (role === 'judge') {
    return <CourtLayout />;
  }

  if (role === 'admin') {
    return <AdminLayout />;
  }

  return (
    <GameLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <main className="space-y-6">
        {(activeTab === 'home' || activeTab === 'HOME') && (
          <MainGamingDashboard onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'campaign' && <CampaignCenterPage />}
        {activeTab === 'business' && <BusinessEmpirePage />}
        {activeTab === 'twitter' && <TwitterXFeedPage />}
        {activeTab === 'parliament' && <ParliamentFloorPage />}
        {activeTab === 'government' && <GovernmentCabinetPage />}
        {activeTab === 'party' && <PartyHQPage />}
        {activeTab === 'alliances' && <AlliancesHubPage />}
        {activeTab === 'market' && <MarketEconomyPage />}
        {activeTab === 'messaging' && <PlayerMessagingConsole />}
        {activeTab === 'results' && <ResultsDashboard />}
        {activeTab === 'store' && <PoliticalStorePage />}
        {activeTab === 'workspace' && (
          <>
            {role === 'politician' && (
              <PoliticianDashboard
                isNewPartyModalOpen={isNewPartyModalOpen}
                onCloseNewPartyModal={() => setIsNewPartyModalOpen(false)}
              />
            )}
            {role === 'president' && <PresidentGovernorDashboard />}
            {role === 'eci' && <ECIDashboard />}
            {role === 'judge' && <JudgeDashboard />}
            {role === 'media' && <MediaDashboard />}
            {role === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>
    </GameLayout>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
