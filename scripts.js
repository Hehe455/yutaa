// --- Firebase configuration ---
var firebaseConfig = {
  apiKey: "AIzaSyBOmm5l-irq0K9FfYi2soctX1fetc613Rc",
  authDomain: "yuta-f0c26.firebaseapp.com",
  projectId: "yuta-f0c26",
  storageBucket: "yuta-f0c26.firebasestorage.app",
  messagingSenderId: "947699204653",
  appId: "1:947699204653:web:1f530ffc40c4f58c63aea4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Persistent device ID utility ---
window.getDeviceId = function () {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = 'dev-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

// --- Log when page loads (new functionality) ---
function logPageView() {
  const deviceId = window.getDeviceId();
  const timestamp = firebase.firestore.Timestamp.fromDate(new Date());

  db.collection("when_she_saw_it").add({
    deviceId: deviceId,
    timestamp: timestamp
  })
  .then(() => console.log("✅ Logged page view:", deviceId, timestamp.toDate()))
  .catch(err => console.error("❌ Error logging page view:", err));
}

// Log as soon as DOM is ready
document.addEventListener("DOMContentLoaded", logPageView);

// --- Your existing main logic ---
document.addEventListener('DOMContentLoaded', async () => {
  const groupsContainer = document.getElementById('groupsContainer');
  const deviceId = window.getDeviceId();

  function logAnalytics(action, groupId) {
    db.collection('analytics').add({
      action,
      groupId: groupId || null,
      deviceId,
      ts: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(console.error);
  }

  try {
    const snapshot = await db.collection('sections').get();
    if (snapshot.empty) {
      groupsContainer.innerText = "No groups found.";
      return;
    }

    snapshot.forEach(doc => {
      const id = doc.id;
      const data = doc.data() || {};
      const name = data.name || id;
      const lastUpdated = data.lastUpdated ? data.lastUpdated.toMillis() : 0;
      const lastOpened = parseInt(localStorage.getItem(`lastOpened_${id}`)) || 0;

      const card = document.createElement('div');
      card.className = 'group-card';
      card.dataset.groupId = id;

      const nameEl = document.createElement('div');
      nameEl.className = 'group-name';
      nameEl.textContent = name;
      card.appendChild(nameEl);

      const dot = document.createElement('span');
      dot.className = 'notification-dot';
      dot.style.display = lastUpdated > lastOpened ? 'inline-block' : 'none';
      card.appendChild(dot);

      card.addEventListener('click', () => {
        localStorage.setItem(`lastOpened_${id}`, Date.now());
        logAnalytics('open_group', id);
        window.location.href = `group.html?id=${encodeURIComponent(id)}`;
      });

      groupsContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading groups', err);
    groupsContainer.innerText = "Error loading groups.";
  }

  function createHeart() {
    const h = document.createElement('div');
    h.className = 'heart';
    h.style.left = Math.random() * window.innerWidth + 'px';
    h.style.top = (window.innerHeight + 40) + 'px';
    h.style.animation = `float ${4 + Math.random() * 3}s linear`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 7000);
  }

  setInterval(createHeart, 600);
});
