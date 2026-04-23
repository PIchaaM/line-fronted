import React from 'react';
import { useLiff } from './hooks/useLiff';
import { isMobile } from './utils/helpers';
import { EnvironmentSection } from './components/EnvironmentSection';
import { ProfileSection } from './components/ProfileSection';
import { AuthenticationSection } from './components/AuthenticationSection';
import { MessageSection } from './components/MessageSection';
import { CameraSection } from './components/CameraSection';
import { WindowSection } from './components/WindowSection';
import { ShortcutSection } from './components/ShortcutSection';
import { FriendshipSection } from './components/FriendshipSection';
import { ServiceMessageSection } from './components/ServiceMessageSection';
import './App.css';

function App() {
  const liff = useLiff();

  if (liff.error) {
    return <div className="error">Error initializing LIFF: {liff.error}</div>;
  }

  if (!liff.initialized) {
    return <div className="loading">Loading...</div>;
  }

  const shouldShowUserContent = liff.isInClient || liff.isLoggedIn;

  return (
    <div id="body" className="app">
      <EnvironmentSection liffState={liff} />
      
      {shouldShowUserContent && (
        <>
          <ProfileSection 
            profile={liff.profile}
            pictureUrl="https://vos.line-scdn.net/imgs/apis/ic_mini.png"
          />
          <FriendshipSection friendship={liff.friendship} />
        </>
      )}

      <AuthenticationSection
        isLoggedIn={liff.isLoggedIn}
        isInClient={liff.isInClient}
        accessToken={liff.accessToken}
        idToken={liff.idToken}
        onLogin={liff.login}
        onLogout={liff.logout}
      />

      {shouldShowUserContent && (
        <>
          <MessageSection
            isInClient={liff.isInClient}
            onSend={liff.sendMessages}
            onShare={liff.shareTargetPicker}
          />

          <CameraSection onScanCode={liff.scanQRCode} />

          <WindowSection
            onOpenWindow={liff.openWindow}
            onCloseWindow={liff.closeWindow}
          />

          <ShortcutSection
            isMobile={isMobile()}
            onCreateShortcut={liff.createShortcut}
          />

          <ServiceMessageSection
            accessToken={liff.accessToken}
            onSendServiceMessage={liff.sendServiceMessage}
          />
        </>
      )}
    </div>
  );
}

export default App;
