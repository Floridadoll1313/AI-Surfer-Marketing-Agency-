/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { WebBuilds } from './pages/WebBuilds';
import { GameBuilds } from './pages/GameBuilds';
import { Workflows } from './pages/Workflows';
import { Automations } from './pages/Automations';
import { Vault } from './pages/Vault';
import { Memorial } from './pages/Memorial';
import { MemberChat } from './pages/MemberChat';
import { ModuleLibrary } from './pages/ModuleLibrary';
import { AdminDashboard } from './pages/AdminDashboard';
import { AIStudio } from './pages/AIStudio';
import { AISurfer } from './pages/AISurfer';
import { NeuralSurfer } from './pages/NeuralSurfer';
import { SupabaseVault } from './pages/SupabaseVault';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { MemberDirectory } from './pages/MemberDirectory';
import { HatterasMap } from './pages/HatterasMap';
import { Marketplace } from './pages/Marketplace';
import { News } from './pages/News';
import { PromptToolkit } from './pages/PromptToolkit';
import { Pricing } from './pages/Pricing';
import { MembersArea } from './pages/MembersArea';
import { SubscriptionGate } from './components/SubscriptionGate';
import { AuthProvider } from './components/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Member Protected Village Routes */}
          <Route path="/rodanthe" element={<SubscriptionGate requiredTier="technologist"><WebBuilds /></SubscriptionGate>} />
          <Route path="/avon" element={<SubscriptionGate requiredTier="technologist"><GameBuilds /></SubscriptionGate>} />
          <Route path="/buxton" element={<SubscriptionGate requiredTier="technologist"><Workflows /></SubscriptionGate>} />
          <Route path="/frisco" element={<SubscriptionGate requiredTier="architect"><Automations /></SubscriptionGate>} />
          <Route path="/hatteras" element={<SubscriptionGate requiredTier="architect"><Vault /></SubscriptionGate>} />
          
          <Route path="/memorial" element={<Memorial />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/join" element={<Pricing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/academy" element={<ModuleLibrary />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Member Protected Routes */}
          <Route path="/sanctuary" element={<SubscriptionGate><MembersArea /></SubscriptionGate>} />
          <Route path="/chat" element={<SubscriptionGate><MemberChat /></SubscriptionGate>} />
          <Route path="/studio" element={<SubscriptionGate><AIStudio /></SubscriptionGate>} />
          <Route path="/ai-surfer" element={<SubscriptionGate><AISurfer /></SubscriptionGate>} />
          <Route path="/surfer" element={<NeuralSurfer />} />
          <Route path="/supabase-vault" element={<SubscriptionGate><SupabaseVault /></SubscriptionGate>} />
          <Route path="/directory" element={<SubscriptionGate><MemberDirectory /></SubscriptionGate>} />
          <Route path="/map" element={<SubscriptionGate><HatterasMap /></SubscriptionGate>} />
          <Route path="/marketplace" element={<SubscriptionGate><Marketplace /></SubscriptionGate>} />
          <Route path="/news" element={<SubscriptionGate><News /></SubscriptionGate>} />
          <Route path="/toolkit" element={<SubscriptionGate><PromptToolkit /></SubscriptionGate>} />
        </Routes>
      </Layout>
    </Router>
  </AuthProvider>
  );
}
