import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { isMobile } from './script.js';
import './App.css';

function App() {
  const [isReady, setIsReady] = useState(false);
  
  const [env, setEnv] = useState({
    os: '', appLanguage: '', sdkVersion: '', lineVersion: '', isInClient: false, isLoggedIn: false, type: ''
  });

  const [profile, setProfile] = useState({
    userId: '', displayName: '', statusMessage: '', pictureUrl: 'https://vos.line-scdn.net/imgs/apis/ic_mini.png', email: ''
  });

  const [tokens, setTokens] = useState({ access: '', id: '' });
  const [qrCodeData, setQrCodeData] = useState('');
  const [friendshipMsg, setFriendshipMsg] = useState('');
  const [serviceMessageData, setServiceMessageData] = useState(null);

  // 🔴 ย้าย 2 ฟังก์ชันนี้ขึ้นมาไว้ข้างบน เพื่อไม่ให้เกิด Error ขีดแดง 🔴
  const fetchUserProfile = async () => {
    const userProfile = await liff.getProfile();
    setProfile({
      ...userProfile,
      email: liff.getDecodedIDToken()?.email || ''
    });
  };

  const fetchFriendship = async () => {
    const friend = await liff.getFriendship();
    if (!friend.friendFlag) {
      setFriendshipMsg('<a href="https://line.me/R/ti/p/@837ircms">Follow our chatbot now!</a>');
    } else {
      setFriendshipMsg('You and our chatbot are friend');
    }
  };

  // --- เริ่มทำงานตอนโหลดหน้าเว็บ ---
  useEffect(() => {
    const initLiff = async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID;
        await liff.init({ liffId });

        const currentOs = liff.getOS();
        setEnv({
          os: currentOs,
          appLanguage: liff.getAppLanguage(),
          sdkVersion: liff.getVersion(),
          lineVersion: liff.getLineVersion(),
          isInClient: liff.isInClient(),
          isLoggedIn: liff.isLoggedIn(),
          type: liff.getContext()?.type || 'none'
        });

        if (currentOs === "web") document.body.style.backgroundColor = "#eff0e9";
        if (currentOs === "android") document.body.style.backgroundColor = "#f6f6f6";
        if (currentOs === "ios") document.body.style.backgroundColor = "#eeeeee";

        if (liff.isInClient() || liff.isLoggedIn()) {
          fetchUserProfile();
          fetchFriendship();
          setTokens({ access: liff.getAccessToken(), id: liff.getIDToken() });
        } else if (isMobile()) {
          window.location.replace(`line://app/${liffId}`);
          setTimeout(() => { window.close(); }, 5000);
        }

        setIsReady(true);
      } catch (error) {
        console.error('LIFF Init failed', error);
      }
    };
    initLiff();
  }, []);

  // --- ฟังก์ชันการทำงานของปุ่มต่างๆ ---
  const handleLogin = () => liff.login();
  const handleLogout = () => { liff.logout(); window.location.reload(); };

  const handleSend = async () => {
    if (!["none", "external"].includes(env.type)) {
      await liff.sendMessages([
        { type: "sticker", packageId: "1", stickerId: "1" },
        { type: "text", text: "This message was sent by sendMessages()" }
      ]);
      alert("Message sent");
    }
  };

  const handleShare = async () => {
    await liff.shareTargetPicker([{
      type: "flex", altText: "This message was shared by shareTargetPicker()",
      contents: {
        type: "bubble", hero: { type: "image", url: "https://vos.line-sdcn.net/imgs/apis/ic_mini.png", aspectRatio: "1:1", size: "full" }
      }
    }]);
  };

  const handleScanCode = async () => {
    const result = await liff.scanCodeV2();
    setQrCodeData(result.value);
  };

  const handleOpenWindow = () => liff.openWindow({ url: "https://linedevth.line.me", external: false });
  const handleCloseWindow = () => liff.closeWindow();

  const handleShortcut = async () => {
    await liff.createShortcutOnHomeScreen({ url: window.location.href });
  };

  const handleServiceMessage = async () => {
    const url = "https://line-backend-nine.vercel.app/api/message";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liffAccessToken: liff.getAccessToken() })
    });
    const data = await response.json();
    setServiceMessageData(data);
    alert("Message sent successfully!");
  };

  // --- ส่วนแสดงผลหน้าเว็บ ---
  if (!isReady) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div>
      <fieldset>
        <legend>Environment:</legend>
        <p><b>OS:</b> {env.os}</p>
        <p><b>App language:</b> {env.appLanguage}</p>
        <p><b>SDK version:</b> {env.sdkVersion}</p>
        <p><b>LINE version:</b> {env.lineVersion}</p>
        <p><b>Is in client?:</b> {env.isInClient ? 'Yes' : 'No'}</p>
        <p><b>Is logged in?:</b> {env.isLoggedIn ? 'Yes' : 'No'}</p>
        <p><b>Screen type:</b> {env.type}</p>
      </fieldset>

      <fieldset>
        <legend>Profile:</legend>
        <img id="pictureUrl" src={profile.pictureUrl} alt="Profile" />
        <p><b>User ID:</b> {profile.userId}</p>
        <p><b>Display name:</b> {profile.displayName}</p>
        <p><b>Status message:</b> {profile.statusMessage}</p>
        <p><b>Email:</b> {profile.email}</p>
      </fieldset>

      <fieldset>
        <legend>Authentication:</legend>
        <p id="accessToken" style={{ wordBreak: 'break-all' }}><b>Access token :</b> {tokens.access}</p>
        <p id="idToken" style={{ wordBreak: 'break-all' }}><b>ID token:</b> {tokens.id}</p>
        {!env.isLoggedIn && <button onClick={handleLogin} style={{ display: 'block' }}>Log In</button>}
        {env.isLoggedIn && <button onClick={handleLogout} style={{ display: 'block' }}>Log Out</button>}
      </fieldset>

      {(env.isInClient || env.isLoggedIn) && (
        <>
          <fieldset>
            <legend>Message:</legend>
            <button onClick={handleSend} style={{ display: 'block' }}>Send Messages</button>
            <button onClick={handleShare} style={{ display: 'block' }}>Share Target Picker</button>
          </fieldset>

          <fieldset>
            <legend>Camera:</legend>
            <p><b>QR code:</b> {qrCodeData}</p>
            <button onClick={handleScanCode} style={{ display: 'block' }}>Scan QR Code</button>
          </fieldset>
        </>
      )}

      <fieldset>
        <legend>Window:</legend>
        <button onClick={handleOpenWindow} style={{ display: 'block' }}>Open Window</button>
        <button onClick={handleCloseWindow} style={{ display: 'block' }}>Close Window</button>
      </fieldset>

      {(env.isInClient || env.isLoggedIn) && isMobile() && (
        <fieldset>
          <legend>Shortcut:</legend>
          <button onClick={handleShortcut} style={{ display: 'block' }}>Add a Shortcut</button>
        </fieldset>
      )}

      {(env.isInClient || env.isLoggedIn) && (
        <>
          <fieldset>
            <legend>Friendship:</legend>
            <p dangerouslySetInnerHTML={{ __html: friendshipMsg }}></p>
          </fieldset>

          <fieldset>
            <legend>Service Messages:</legend>
            {serviceMessageData && (
              <pre style={{ overflow: 'auto' }}>
                {JSON.stringify(serviceMessageData, null, 2)}
              </pre>
            )}
            <button onClick={handleServiceMessage} style={{ display: 'block' }}>Send a Service Message</button>
          </fieldset>
        </>
      )}
    </div>
  );
}

export default App;