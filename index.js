// Import stylesheets
import './style.css';

// 14.2. Is mobile ?
import { isMobile } from './script.js';

// Body element
const body = document.querySelector("#body");

// Environment elements
const os = document.querySelector("#os");
const appLanguage = document.querySelector("#appLanguage");
const sdkVersion = document.querySelector("#sdkVersion");
const lineVersion = document.querySelector("#lineVersion");
const isInClient = document.querySelector("#isInClient");
const isLoggedIn = document.querySelector("#isLoggedIn");
const type = document.querySelector("#type");

// Profile elements
const email = document.querySelector("#email");
const userId = document.querySelector("#userId");
const pictureUrl = document.querySelector("#pictureUrl");
const displayName = document.querySelector("#displayName");
const statusMessage = document.querySelector("#statusMessage");

// Message elements
const btnSend = document.querySelector("#btnSend");
const btnShare = document.querySelector("#btnShare");

// Window elements
const btnOpenWindow = document.querySelector("#btnOpenWindow");
const btnCloseWindow = document.querySelector("#btnCloseWindow");

// QR elements
const qrCode = document.querySelector("#qrCode");
const btnScanCode = document.querySelector("#btnScanCode");

// Shortcut element
const btnShortcut = document.querySelector("#btnShortcut");

// Friendship element
const friendship = document.querySelector("#friendship");

// Authentication elements
const accessToken = document.querySelector("#accessToken");
const idToken = document.querySelector("#idToken");
const btnLogIn = document.querySelector("#btnLogIn");
const btnLogOut = document.querySelector("#btnLogOut");

// Service Message elements
const serviceMessage = document.querySelector("#serviceMessage");
const btnServiceMessage = document.querySelector("#btnServiceMessage");

// 1.1. Specify your LIFF ID
const liffId = "2009824215-ueogpC3a";
const bodyElement = document.body;

async function main() {
  // 1.2. Initialize LIFF SDK
  await liff.init({liffId});

  // 2.2. Call getEnviroment();
  getEnviroment();
  // 2.3. Try a function
  const os = liff.getOS();
  if (bodyElement) {
    if (os === "web") bodyElement.style.backgroundColor = "#eff0e9";
    if (os === "android") bodyElement.style.backgroundColor = "#f6f6f6";
    if (os === "ios") bodyElement.style.backgroundColor = "#eeeeee";
  }
  // 3.2. Call getUserProfile();
  
  // 5. Is in client ?
  if (liff.isInClient()) {
    getUserProfile(); 
    btnSend.style.display = "block";
    manageViewForLoggedInUser();
    getFriendship();
    getAuthentication();

  }else{
    if (isMobile()) {
      window.location.replace(`line://app/${liffId}`);
      setTimeout(() => { window.close(); }, "5000");
      return;
    }

    if (liff.isLoggedIn()) {
      getUserProfile(); 
      btnLogIn.style.display = "none";
      btnLogOut.style.display = "block";

      manageViewForLoggedInUser();
      getFriendship();
      getAuthentication();

    }else{
      btnLogIn.style.display = "block";
      btnLogOut.style.display = "none";
    }
  }
  btnOpenWindow.style.display = "block";

  btnCloseWindow.style.display = "block";
}
main();

function getEnviroment() {
  // 2.1. Get environment info

  os.append(liff.getOS());

  appLanguage.append(liff.getAppLanguage());
  sdkVersion.append(liff.getVersion());
  lineVersion.append(liff.getLineVersion());
  isInClient.append(liff.isInClient());
  isLoggedIn.append(liff.isLoggedIn());

  // utou, group, room, external, none
  type.append(liff.getContext().type);
}

async function getUserProfile() {
  // 3.1. Get basic profile
  const profile = await liff.getProfile();
  pictureUrl.src = profile.pictureUrl;
  userId.append(profile.userId);
  displayName.append(profile.displayName);
  statusMessage.append(profile.statusMessage);

  // 4. Get email
  email.append(liff.getDecodedIDToken().email);
}

function manageViewForLoggedInUser() {
  // 10.2. Display share messages button
  btnShare.style.display = "block";

  // 11.2. Display QR code button
  btnScanCode.style.display = "block";

  // 14.3. Display add shortcut button"
  if (isMobile()) {
    btnShortcut.style.display = "block";
  }

  // 17.2. Display service message button
  btnServiceMessage.style.display = "block";
}

btnLogIn.onclick = () => {
  // 7. Perform login
  liff.login();
}

btnLogOut.onclick = () => {
  // 8. Perform logout
  liff.logout();
  window.location.reload();
}

btnSend.onclick = async() => {
  // 9.1. Check context
  if (!["none","external"].includes(liff.getContext()).type){
    await liff.sendMessages([
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
}

btnShare.onclick = async() => {
  // 10.1. Share messages
  await liff.shareTargetPicker([
    {
      type: "flex",
      altText: "This message was shared by shareTargetPicker()",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://vos.line-sdcn.net/imgs/apis/ic_mini.png",
          aspectRatio: "1:1",
          size: "full"
        }
      }
    }
  ])
}

btnScanCode.onclick = async() => {
  // 11.1. QR code reader
  const result = await liff.scanCodeV2();
  qrCode.append(result.value);
}

btnOpenWindow.onclick = () => {
  // 12.1. Open window
  liff.openWindow({
    url: "https://linedevth.line.me",
    external: false // in app browser
  });
}

btnCloseWindow.onclick = () => {
  // 13.1. Close window
  liff.closeWindow();
}

btnShortcut.onclick = async() => {
  // 14.1. Add shortcut (Verified MINI App)
  await liff.createShortcutOnHomeScreen({
    // url: `https://miniapp.line.me/${liffId}`
    url: `https://line-mini-app-edzw6cdg.stackblitz.io`
    /**
    The url can be
    + LIFF URL,
    + Permanent link,
    + The endpoint URL of the LINE MINI App,
    + URL that begins with the endpoint URL of the LINE MINI App
    */
  });
}

async function getFriendship() {
  // 15.1. Get friendship
  let msg = "You and our chatbot are friend";
  const friend = await liff.getFriendship();
  if (!friend.friendFlag) {
    msg = "<a href=\"https://line.me/R/ti/p/@837ircms\">Follow our chatbot now!</a>";
  }
  friendship.innerHTML = msg;
}

function getAuthentication() {
  // 16.1. Get authentication info
  accessToken.append(liff.getAccessToken());
  idToken.append(liff.getIDToken());
}

btnServiceMessage.onclick = async() => {
  // 17.1. Request Service Message API
  const url = "https://line-backend-nine.vercel.app/api/message";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ liffAccessToken: liff.getAccessToken() })
  });
  const data = await response.json();
  serviceMessage.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  alert("Message sent successfully!");

}
