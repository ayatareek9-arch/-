// app.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// ====== ضع هنا إعدادات Firebase من مشروعك ======
const firebaseConfig = {
  apiKey: "AIzaSyDpzYcfuGDg28dnSh-6EKSTgS3q0gMB9CA",
  authDomain: "shaidwarbah.firebaseapp.com",
  projectId: "shaidwarbah",
  storageBucket: "shaidwarbah.firebasestorage.app",
  messagingSenderId: "547128797093",
  appId: "1:547128797093:web:f4d861c845b0da79526a4c"
};
// =============================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const emailSignUp = document.getElementById('emailSignUp');
const emailLogin = document.getElementById('emailLogin');
const googleLogin = document.getElementById('googleLogin');
const startNow = document.getElementById('startNow');
const userBalanceSpan = document.getElementById('userBalance');
const adsList = document.getElementById('adsList');
const proofsList = document.getElementById('proofsList');
const withdrawBtn = document.getElementById('withdrawBtn');

loginBtn && loginBtn.addEventListener('click', ()=> loginModal.style.display = 'flex');
window.closeLogin = ()=> loginModal.style.display = 'none';

// Auth actions
emailSignUp && emailSignUp.addEventListener('click', async ()=>{
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  try{ await createUserWithEmailAndPassword(auth,email,pass); alert('تم إنشاء الحساب'); closeLogin(); }
  catch(e){ alert(e.message); }
});
emailLogin && emailLogin.addEventListener('click', async ()=>{
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  try{ await signInWithEmailAndPassword(auth,email,pass); alert('تم الدخول'); closeLogin(); }
  catch(e){ alert(e.message); }
});
googleLogin && googleLogin.addEventListener('click', async ()=>{
  const provider = new GoogleAuthProvider();
  try{ await signInWithPopup(auth, provider); closeLogin(); }
  catch(e){ alert(e.message); }
});

// monitor auth
onAuthStateChanged(auth, async user=>{
  if(user){
    // load or create user doc
    const uref = doc(db,'users',user.uid);
    const snap = await getDoc(uref);
    if(!snap.exists()) await setDoc(uref,{email:user.email,createdAt:new Date(),balance:0});
    const userSnap = await getDoc(uref);
    const b = (userSnap.data() && userSnap.data().balance) || 0;
    if(userBalanceSpan) userBalanceSpan.textContent = Number(b).toFixed(2);
    loginBtn.textContent = 'حسابتك';
    loginBtn.onclick = ()=> alert('أهلًا ' + (user.displayName||user.email));
  } else {
    if(userBalanceSpan) userBalanceSpan.textContent = '0.00';
    loginBtn.textContent = 'تسجيل دخول';
    loginBtn.onclick = ()=> loginModal.style.display = 'flex';
  }
});

// load ads (dynamic)
async function loadAds(){
  adsList.innerHTML = '<p class="muted">جارٍ تحميل الإعلانات...</p>';
  const q = query(collection(db,'ads'), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  adsList.innerHTML = '';
  snap.forEach(d=>{
    const data = d.data();
    const card = document.createElement('div'); card.className='card';
    const img = data.img ? `<img src="${data.img}" style="width:100%;border-radius:8px;margin-bottom:8px"/>` : '';
    card.innerHTML = `${img}<div style="font-weight:700">${data.title||''}</div><div class="muted small">${data.link?'<a href="'+data.link+'" target="_blank">اذهب</a>':''}</div>`;
    adsList.appendChild(card);
  });
}

// load proofs
async function loadProofs(){
  proofsList.innerHTML = '<p class="muted">جارٍ تحميل الإثباتات...</p>';
  const q = query(collection(db,'proofs'), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  proofsList.innerHTML = '';
  snap.forEach(d=>{
    const data = d.data();
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<div class="proof-amount">${data.amount||'EGP 0.00'}</div><div class="muted small">${data.by||'مستخدم'} — ${new Date(data.createdAt?.seconds?data.createdAt.seconds*1000:Date.now()).toLocaleDateString()}</div>`;
    proofsList.appendChild(card);
  });
}

// withdraw request
withdrawBtn && withdrawBtn.addEventListener('click', async ()=>{
  const user = auth.currentUser;
  if(!user) return alert('سجّل الدخول أولاً');
  const amount = Number(document.getElementById('w_amount').value || 0);
  const method = document.getElementById('w_method').value;
  const receiver = document.getElementById('w_receiver').value || '';
  if(amount <= 0 || !receiver) return alert('املأ الحقول المطلوبة');
  try{
    await addDoc(collection(db,'withdrawals'),{
      uid:user.uid, email:user.email, amount, method, receiver, status:'pending', createdAt:new Date()
    });
    alert('تم إرسال طلب السحب بنجاح');
    document.getElementById('w_amount').value=''; document.getElementById('w_receiver').value='';
  }catch(e){ alert(e.message); }
});

startNow && startNow.addEventListener('click', ()=> {
  const el = document.getElementById('proofs'); if(el) el.scrollIntoView({behavior:'smooth'});
});

// initial load
loadAds(); loadProofs();
