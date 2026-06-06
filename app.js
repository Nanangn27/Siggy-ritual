// =========================
// SIGGY FULL APP
// =========================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const TREASURY =
"0x433d4d43afd32a5ea40e875236db26d4c3b7886f";

let provider = null;
let signer = null;
let account = null;

let xp = Number(
localStorage.getItem(
"siggy_xp"
) || 0
);

// =========================
// PAGE NAVIGATION
// =========================

function showPage(id){

document
.querySelectorAll(".page")
.forEach(page=>{

page.classList.remove(
"active"
);

});

const target =
document.getElementById(
id
);

if(target){

target.classList.add(
"active"
);

}

}

// =========================
// WALLET CONNECT
// =========================
function openWalletModal(){
    document.getElementById("walletModal").style.display = "flex";
}

function closeWalletModal(){
    document.getElementById("walletModal").style.display = "none";
}
async function connectWallet(){

try{

if(!window.ethereum){

alert(
"Please install OKX Wallet, MetaMask, Rabby, or use Mises Browser"
);

window.open(
"https://metamask.io/download/",
"_blank"
);

return;

}

provider =
window.ethereum;

const accounts =
await provider.request({
  method:
  "eth_requestAccounts"
});

if(!accounts || !accounts.length){

  alert(
  "No account returned from wallet. Unlock wallet first."
  );

  return;

}

account =
accounts[0];
window.ethereum.on(
"accountsChanged",
(accounts)=>{

  if(accounts.length){

    account = accounts[0];
    updateWallet();

  }else{

    disconnectWallet();

  }

});
const walletHeader =
document.getElementById("walletHeader");

if(walletHeader){
    walletHeader.innerText =
    account.slice(0,6) +
    "..." +
    account.slice(-4);
}
try{

await window.ethereum.request({
  method:"wallet_switchEthereumChain",
  params:[{
    chainId:"0x7bb"
  }]
});

}catch(err){

console.log(err);

}
provider = new ethers.BrowserProvider(window.ethereum);
signer = await provider.getSigner();
QRCode.toCanvas(
document.getElementById("walletQR"),
account
);
alert(account);

updateWallet();

addActivity(
"Wallet Connected"
);

}catch(err){

console.log(err);

alert(
err.message
);

}

}

function disconnectWallet(){

account = null;

const addr =
document.getElementById(
"walletAddress"
);

if(addr){

addr.innerText =
"Not Connected";

}

const bal =
document.getElementById(
"walletBalance"
);

if(bal){

bal.innerText =
"0 RIT";

}
const walletHeader =
document.getElementById("walletHeader");

if(walletHeader){
    walletHeader.innerText =
    "Connect Wallet";
}
addActivity(
"Wallet Disconnected"
);

}
function walletMenu(){

    if(!account){
        openWalletModal();
        return;
    }

    const go = confirm(
        "Wallet Connected\n\nDisconnect Wallet?"
    );

    if(go){
        disconnectWallet();
    }
}
function connectMetaMask(){
    closeWalletModal();
    connectWallet();
}

function connectRabby(){
    closeWalletModal();
    connectWallet();
}

function connectOKX(){
    closeWalletModal();
    connectWallet();
}

function connectWalletConnect(){
    closeWalletModal();
    alert("WalletConnect Coming Soon");
}
// =========================
// UPDATE WALLET
// =========================

async function updateWallet(){

if(!account){
return;
}

const addr =
document.getElementById(
"walletAddress"
);

if(addr){

addr.innerText =
shorten(account);

}
const walletHeader =
document.getElementById("walletHeader");

if(walletHeader){
walletHeader.innerText =
shorten(account);
}
try{

const accounts =
await window.ethereum.request({
method:"eth_accounts"
});

if(accounts.length){

const bal =
document.getElementById(
"walletBalance"
);

const balanceHex =
await window.ethereum.request({
method:"eth_getBalance",
params:[
account,
"latest"
]
});

const balance =
parseInt(
balanceHex,
16
) / 1e18;

if(bal){

bal.innerText =
balance.toFixed(4)
+ " RIT";

}

const share =
document.getElementById(
"shareBalance"
);

if(share){

share.innerText =
balance.toFixed(4)
+ " RIT";

}

const txEl =
document.getElementById(
"shareTx"
);

if(txEl){
const activityEl =
document.getElementById(
"shareActivity"
);

const txHex =
await window.ethereum.request({
method:"eth_getTransactionCount",
params:[
account,
"latest"
]
});

const txCount =
parseInt(txHex,16);

if(activityEl){
  activityEl.innerText = Math.floor(txCount / 10) + 1;
}

txEl.innerText = txCount;
const xpEl =
document.getElementById("xpValue");

if(xpEl){
xpEl.innerText = txCount * 100;
}
}

}

}catch(err){

console.log(err);

}

}

// =========================
// SHORT ADDRESS
// =========================

function shorten(addr){

return (
addr.slice(0,6)
+
"..."
+
addr.slice(-4)
);

}

// =========================
// MOOD SYSTEM
// =========================

function setMood(type){

const siggy =
document.getElementById(
"siggyMood"
);

const share =
document.getElementById(
"shareMood"
);

if(!siggy){
return;
}
siggy.addEventListener("click",(e)=>{

  createVoidParticles(
e.clientX,
e.clientY
);

});
const file =
"assets/siggy_" +
type +
".png";

siggy.src = file;

if(share){
    share.src = file;
}

const mood =
document.getElementById(
"moodText"
);

if(mood){

const labels = {

idle:
"Idle Mode",

happy:
"Happy Mode",

sad:
"Sad Mode",

chaos:
"Chaos Mode"

};

mood.innerText =
labels[type] ||
"Idle Mode";

}

}
function playMagicSound(){

const osc1 = audioCtx.createOscillator();
const osc2 = audioCtx.createOscillator();
const gain = audioCtx.createGain();

osc1.type = "sine";
osc2.type = "triangle";

osc1.frequency.setValueAtTime(180, audioCtx.currentTime);
osc2.frequency.setValueAtTime(360, audioCtx.currentTime);

osc1.frequency.exponentialRampToValueAtTime(
80,
audioCtx.currentTime + 0.4
);

osc2.frequency.exponentialRampToValueAtTime(
120,
audioCtx.currentTime + 0.4
);

gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(
0.001,
audioCtx.currentTime + 0.5
);

osc1.connect(gain);
osc2.connect(gain);
gain.connect(audioCtx.destination);

osc1.start();
osc2.start();

osc1.stop(audioCtx.currentTime + 0.5);
osc2.stop(audioCtx.currentTime + 0.5);

}
function randomMood(){
	
	playMagicSound();
	
const moods = [
"idle",
"happy",
"sad",
"chaos"
];

const mood =
moods[Math.floor(Math.random()*moods.length)];

setMood(mood);
addXP(5);
addPet();
const siggy = document.getElementById("siggyMood");

siggy.style.transform = "scale(1.1)";
siggy.style.filter = "drop-shadow(0 0 15px #b14cff)";

setTimeout(() => {
  siggy.style.transform = "scale(1)";
  siggy.style.filter = "none";
}, 300);
const replies = [
" Purr...",
" The Void watches...",
" Siggy likes that",
" Chaos is near...",
" XP +5",
" *Siggy rubs against you*",
" Void energy increased",
" Siggy trusts you more"
];


document.getElementById("aiReply").innerText =
 replies[Math.floor(Math.random()*replies.length)];
}
function addPet(){

  let pets =
  parseInt(localStorage.getItem("pets") || 0);

  pets++;

  localStorage.setItem("pets", pets);

  const petCount =
  document.getElementById("petCount");

  if(petCount){
    petCount.innerText =
    " Pets: " + pets;
  }

}
// =========================
// FEED SIGGY
// =========================
function createVoidParticles(x,y){

for(let i=0;i<8;i++){

const p =
document.createElement("div");

p.className = "void-particle";

const dx =
(Math.random()*120-60)+"px";

const dy =
(Math.random()*120-60)+"px";

p.style.left = x+"px";
p.style.top = y+"px";

p.style.setProperty("--x",dx);
p.style.setProperty("--y",dy);

document.body.appendChild(p);

setTimeout(()=>{
p.remove();
},700);

}

}
async function feedSiggy(amount){

if(!account){
alert("Connect wallet first");
return;
}

try{
const chainId = await window.ethereum.request({
  method: "eth_chainId"
});

if(chainId !== "0x7bb"){
  alert("Please switch to Ritual Network");
  return;
}
const txHash =
await window.ethereum.request({
method:"eth_sendTransaction",
params:[{
from:account,
to:TREASURY,
value:"0x"+Math.floor(
Number(amount)*1e18
).toString(16)
}]
});

addActivity(
"TX: "+txHash.slice(0,10)
);

randomMood();

addXP(25);

localStorage.setItem(
"last_feed",
Date.now()
);

addActivity(
"Fed Siggy "+amount+" RIT"
);

let txCount =
parseInt(
localStorage.getItem("txCount") || 0
);

txCount++;

localStorage.setItem(
"txCount",
txCount
);

await updateWallet();

alert(
"Feed success\n\n"+txHash
);

}catch(err){

alert(err.message);

}

}

// =========================
// XP SYSTEM
// =========================

function addXP(value){

xp += value;

localStorage.setItem(

"siggy_xp",

xp

);

const el =
document.getElementById(
"xpValue"
);

if(el){

el.innerText =
xp;

}

}

function getLevel(){

return Math.floor(
xp / 100
) + 1;

}

// =========================
// ACTIVITY SYSTEM
// =========================

function addActivity(text){

let items =
JSON.parse(

localStorage.getItem(
"siggy_activity"
)

||

"[]"

);

items.unshift({

text:text,

time:new Date()
.toLocaleString()

});

items =
items.slice(0,10);

localStorage.setItem(

"siggy_activity",

JSON.stringify(items)

);

renderActivity();

}

function renderActivity(){

const wrap =
document.getElementById(
"recentActivity"
);

if(!wrap){
return;
}

const items =
JSON.parse(

localStorage.getItem(
"siggy_activity"
)

||

"[]"

);

if(items.length===0){

wrap.innerHTML =
"No recent activity";

return;

}

wrap.innerHTML =
items.map(item=>`

<div class="activity-item"><strong>
${item.text}
</strong><br><small>
${item.time}
</small></div>`).join("");

}

// =========================
// LOCAL STORAGE
// =========================

function saveData(){

localStorage.setItem(

"siggy_xp",

xp

);

}

function loadData(){

xp = Number(

localStorage.getItem(
"siggy_xp"
)

||

0

);

renderActivity();

}

// =========================
// PROFILE UPLOAD
// =========================

function initProfileUpload(){

const upload =
document.getElementById(
"profileUpload"

);

if(!upload){
return;
}

upload.addEventListener(

"change",

function(e){

const file =
e.target.files[0];

if(!file){
return;
}

const reader =
new FileReader();

reader.onload =
function(){

localStorage.setItem(
"siggy_pfp",
reader.result
);

const preview =
document.getElementById(
"profilePreview"
);

if(preview){
  preview.src = reader.result;
}

};

reader.readAsDataURL(
file
);

}

);

}

// =========================
// USERNAME SYNC
// =========================

function initUsername(){

const username =
document.getElementById(
"username"
);

if(!username){
return;
}

const saved =
localStorage.getItem(
"siggy_username"
);

if(saved){

username.value =
saved;

const share =
document.getElementById(
"shareUsername"
);

if(share){

share.innerText =
saved;

}
}

username.addEventListener(

"input",

function(){

localStorage.setItem(

"siggy_username",

this.value

);

const share =
document.getElementById(
"shareUsername"
);

if(share){

share.innerText =
this.value ||
"Username";

}

}

);

}

// =========================
// SAVE CARD
// =========================

function saveCard(){

const card =
document.getElementById(
"shareCard"
);
const usernameInput =
document.getElementById("username");

const shareUsername =
document.getElementById("shareUsername");

if(usernameInput && shareUsername){
  shareUsername.innerText =
  usernameInput.value || "Username";
}
if(!card){

alert(
"Share card not found"
);

return;

}
const signaturePad =
document.getElementById("signaturePad");

const oldSignature =
document.getElementById("savedSignature");

if(oldSignature){
oldSignature.remove();
}

const signatureImg =
document.createElement("img");

signatureImg.id = "savedSignature";
signatureImg.src =
signaturePad.toDataURL("image/png");

signatureImg.style.width = "180px";
signatureImg.style.height = "70px";

signatureImg.style.display = "block";
signatureImg.style.margin = "15px auto";

card.appendChild(signatureImg);
const savedPfp = localStorage.getItem("siggy_pfp");

htmlToImage.toPng(card,{
  width:500,
  height:650,
  canvasWidth:500,
  canvasHeight:650,
  pixelRatio:2,
  backgroundColor:"#120021",
  style:{
    margin:"0",
    transform:"none",
    left:"0",
    right:"0"
  }
  }
)
.then(function(dataUrl){
if(window.ethereum){

document.getElementById(
"previewImage"
).src = dataUrl;

document.getElementById(
"imagePreviewModal"
).style.display = "block";

signatureImg.remove();

return;

}

else{

const link =
document.createElement(
"a"
);

link.download =
"siggy-card.png";

link.href =
dataUrl;

link.click();

}

signatureImg.remove();

})

.catch(function(err){

console.log(err);

alert(err.message);

});

}

// =========================
// STARTUP
// =========================

document.addEventListener(

"DOMContentLoaded",

function(){

loadData();

initProfileUpload();

initUsername();

const pfp =
localStorage.getItem("siggy_pfp");
if(pfp){

const preview =
document.getElementById(
"profilePreview"
);

if(preview){
  preview.src = pfp;
}

}


if(!pfp){
  setMood("idle");
}

console.log(
"SIGGY FULL READY"
);

}

);

// =========================
// ERROR LOGGER
// =========================

window.onerror =
function(msg){

console.log(
"SIGGY ERROR:",
msg
);

};
async function askSiggy() {


const question =
document.getElementById("aiInput").value;

const replyEl =
document.getElementById("aiReply");

  replyEl.innerText = "✨ Generating response...";

  try {


const res = await fetch(
"https://siggy-ai.na2ng1000.workers.dev/",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
message: question
})
}
);


      

    const data = await res.json();

replyEl.innerText = data.reply;

  } catch(err) {


replyEl.innerText =
"ERROR: " + err.message;

console.log(err);

  }
  }
  const canvas = document.getElementById("signaturePad");

if(canvas){

const ctx = canvas.getContext("2d");

let drawing = false;

canvas.addEventListener("mousedown", () => {
drawing = true;
});

canvas.addEventListener("mouseup", () => {
drawing = false;
ctx.beginPath();
});
canvas.addEventListener("touchstart", (e) => {
e.preventDefault();
drawing = true;
});

canvas.addEventListener("touchend", (e) => {
e.preventDefault();
drawing = false;
ctx.beginPath();
});
canvas.addEventListener("mousemove", (e) => {

if(!drawing) return;

const rect = canvas.getBoundingClientRect();

ctx.lineWidth = 4;
ctx.strokeStyle = "#fff";
ctx.lineCap = "round";

ctx.lineTo(
e.clientX - rect.left,
e.clientY - rect.top
);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(
e.clientX - rect.left,
e.clientY - rect.top
);

});
canvas.addEventListener("touchmove", (e) => {

e.preventDefault();

if(!drawing) return;

const rect = canvas.getBoundingClientRect();
const touch = e.touches[0];

ctx.lineWidth = 2;
ctx.strokeStyle = "#fff";
ctx.lineCap = "round";

ctx.lineTo(
touch.clientX - rect.left,
touch.clientY - rect.top
);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(
touch.clientX - rect.left,
touch.clientY - rect.top
);

});
window.clearSignature = function(){
ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);
};

}
async function sendRIT(){

try{

if(!signer){
alert("Connect wallet first");
return;
}

const to =
document.getElementById("sendAddress").value.trim();

const amount =
document.getElementById("sendAmount").value.trim();

if(!to || !amount){
alert("Fill address and amount");
return;
}

const tx =
await signer.sendTransaction({
to: to,
value: ethers.parseEther(amount)
});

alert(
"Transaction Sent\n\n" +
tx.hash
);

await tx.wait();

updateWallet();

addActivity(
"Sent " + amount + " RITUAL"
);

}catch(err){

console.log(err);

alert(err.message);

}

}
function copyAddress(){

if(!account){
alert("Connect wallet first");
return;
}

navigator.clipboard.writeText(account);

alert("Wallet address copied");

}
function saveSettings(){

localStorage.setItem(
"siggyName",
document.getElementById("siggyName").value
);
document.getElementById("shareUsername").innerText =
document.getElementById("siggyName").value;

const mood =
document.getElementById("defaultMood").value;

const shareMood =
document.getElementById("shareMood");

if(shareMood){

if(mood === "Happy"){
shareMood.src = "assets/siggy_happy.png";
}
else if(mood === "Sad"){
shareMood.src = "assets/siggy_sad.png";
}
else if(mood === "Chaos"){
shareMood.src = "assets/siggy_chaos.png";
}
else{
shareMood.src = "assets/siggy_idle.png";
}

}
const username =
document.getElementById("shareUsername");

if(username){
username.innerText =
document.getElementById("siggyName").value;
}
alert("Settings Saved");
}
function openRevoke(){

    const go = confirm(
        "⚠️ Void Security Check\n\nOpen Revoke.cash to review active token approvals?"
    );

    if(go){
        window.open(
            "https://revoke.cash",
            "_blank"
        );
    }

}
function shuffleSigil(){

    const status =
    document.getElementById(
        "sigilStatus"
    );

    if(status){
        status.innerText =
        "✨ Ritual Beginning...";
    }

}