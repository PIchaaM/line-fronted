import { useEffect, useState } from 'react';
import { LIFF_ID } from '../utils/liff-config';
import { isMobile } from '../utils/helpers';

export const useLiff = () => {
  const [liffState, setLiffState] = useState({
    initialized: false,
    isInClient: false,
    isLoggedIn: false,
    os: null,
    appLanguage: null,
    sdkVersion: null,
    lineVersion: null,
    contextType: null,
    profile: null,
    friendship: null,
    accessToken: null,
    idToken: null,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // Initialize LIFF SDK
        await window.liff.init({ liffId: LIFF_ID });

        // Get environment info
        const os = window.liff.getOS();
        const appLanguage = window.liff.getAppLanguage();
        const sdkVersion = window.liff.getVersion();
        const lineVersion = window.liff.getLineVersion();
        const isInClient = window.liff.isInClient();
        const isLoggedIn = window.liff.isLoggedIn();
        const contextType = window.liff.getContext().type;

        // Set background color based on OS
        if (os === "web") document.body.style.backgroundColor = "#eff0e9";
        if (os === "android") document.body.style.backgroundColor = "#f6f6f6";
        if (os === "ios") document.body.style.backgroundColor = "#eeeeee";

        setLiffState(prev => ({
          ...prev,
          os,
          appLanguage,
          sdkVersion,
          lineVersion,
          isInClient,
          isLoggedIn,
          contextType,
        }));

        // Handle user in client or logged in
        if (isInClient) {
          const profile = await window.liff.getProfile();
          const idToken = window.liff.getDecodedIDToken();
          const friendship = await window.liff.getFriendship();
          const accessToken = window.liff.getAccessToken();
          const idTokenStr = window.liff.getIDToken();

          setLiffState(prev => ({
            ...prev,
            profile: { ...profile, email: idToken.email },
            friendship,
            accessToken,
            idToken: idTokenStr,
          }));
        } else if (isMobile()) {
          window.location.replace(`line://app/${LIFF_ID}`);
          setTimeout(() => { window.close(); }, 5000);
          return;
        } else if (isLoggedIn) {
          const profile = await window.liff.getProfile();
          const idToken = window.liff.getDecodedIDToken();
          const friendship = await window.liff.getFriendship();
          const accessToken = window.liff.getAccessToken();
          const idTokenStr = window.liff.getIDToken();

          setLiffState(prev => ({
            ...prev,
            profile: { ...profile, email: idToken.email },
            friendship,
            accessToken,
            idToken: idTokenStr,
          }));
        }

        setLiffState(prev => ({ ...prev, initialized: true }));
      } catch (err) {
        console.error('LIFF initialization error:', err);
        setError(err.message);
      }
    };

    if (window.liff) {
      initializeLiff();
    }
  }, []);

  const login = () => {
    window.liff.login();
  };

  const logout = () => {
    window.liff.logout();
    window.location.reload();
  };

  const sendMessages = async () => {
    try {
      if (!["none", "external"].includes(window.liff.getContext().type)) {
        await window.liff.sendMessages([
          {
            type: "sticker",
            packageId: "1",
            stickerId: "1"
          },
          {
            type: "text",
            text: "This message was sent by sendMessages()"
          }
        ]);
        alert("Message sent");
      }
    } catch (err) {
      console.error('Error sending messages:', err);
    }
  };

  const shareTargetPicker = async () => {
    try {
      await window.liff.shareTargetPicker([
        {
          type: "flex",
          altText: "This message was shared by shareTargetPicker()",
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              url: "https://vos.line-scdn.net/imgs/apis/ic_mini.png",
              aspectRatio: "1:1",
              size: "full"
            }
          }
        }
      ]);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const scanQRCode = async () => {
    try {
      const result = await window.liff.scanCodeV2();
      return result.value;
    } catch (err) {
      console.error('Error scanning QR code:', err);
      return null;
    }
  };

  const openWindow = (url) => {
    try {
      window.liff.openWindow({
        url: url,
        external: false
      });
    } catch (err) {
      console.error('Error opening window:', err);
    }
  };

  const closeWindow = () => {
    try {
      window.liff.closeWindow();
    } catch (err) {
      console.error('Error closing window:', err);
    }
  };

  const createShortcut = async () => {
    try {
      await window.liff.createShortcutOnHomeScreen({
        url: `https://line-fronted.vercel.app`
      });
    } catch (err) {
      console.error('Error creating shortcut:', err);
    }
  };

  const sendServiceMessage = async (accessToken) => {
    try {
      const url = "https://line-backend-nine.vercel.app/api/message";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liffAccessToken: accessToken })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error sending service message:', err);
      return null;
    }
  };

  return {
    ...liffState,
    login,
    logout,
    sendMessages,
    shareTargetPicker,
    scanQRCode,
    openWindow,
    closeWindow,
    createShortcut,
    sendServiceMessage,
    error
  };
};
