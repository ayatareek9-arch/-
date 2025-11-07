import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// ضع نفس firebaseConfig هنا كما في app.js
const firebaseConfig = {
  apiKey: "AIzaSyDpzYcfuGDg28dnSh-6EKSTgS3q0gMB9CA",
  authDomain: "shaidwarbah.firebaseapp.com",
  projectId: "shaidwarbah",
  storageBucket: "shaidwarbah.firebasestorage.app",
  messagingSenderId: "547128797093",
  appId: "1:547128797093:web:f4d861c845b0da79526a4c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// simple admin login prompt on page load
(async function initAdmin(){
  const email = prompt('ادخل ايميل الأدمن:');
  const pass = prompt('ادخل كلمة المرور:');
  try{
    await signInWithEmailAndPassword(auth,email,pass);
  }catch(e){ alert('فشل تسجيل الدخول: '+e.message); location.href='index.html'; return; }

  loadAdsAdmin(); loadWithdrawals();
})();

document.getElementById('addAd')?.addEventListener('click', async ()=>{
  const title = document.getElementById('ad_title').value;
  const link = document.getElementById('ad_link').value;
  const img = document.getElementById('ad_img').value;
  if(!title) return alert('اكتب عنوان الإعلان');
  await addDoc(collection(db,'ads'),{title,link,img,createdAt:new Date()});
  alert('تم إضافة الإعلان'); loadAdsAdmin();
});

async function loadAdsAdmin(){
  const list = document.getElementById('adsAdminList'); list.innerHTML='جارٍ التحميل...';
  const q = query(collection(db,'ads'), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  list.innerHTML='';
  snap.forEach(d=>{
    const data = d.data();
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<div style="font-weight:700">${data.title}</div><div class="muted small">${data.link||''}</div><div style="margin-top:8px"><button data-id="${d.id}" class="btn ghost delAd">حذف</button></div>`;
    list.appendChild(el);
  });
  document.querySelectorAll('.delAd').forEach(b=>{
    b.addEventListener('click', async (e)=>{
      const id = e.currentTarget.dataset.id;
      if(!confirm('حذف الإعلان؟')) return;
      await deleteDoc(doc(db,'ads',id));
      loadAdsAdmin();
    });
  });
}

async function loadWithdrawals(){
  const list = document.getElementById('withdrawalsAdmin'); list.innerHTML='جارٍ التحميل...';
  const q = query(collection(db,'withdrawals'), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  list.innerHTML='';
  snap.forEach(d=>{
    const data = d.data();
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<div style="font-weight:700">${data.email||data.receiver} — ${data.amount}</div><div class="muted small">حالة: ${data.status}</div>`;
    list.appendChild(el);
  });
}
