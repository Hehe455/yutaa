document.addEventListener('DOMContentLoaded', async () => {
  const groupsContainer = document.getElementById('groupsContainer');
  const deviceId = window.getDeviceId();

  function logAnalytics(action, groupId) {
    db.collection('analytics')
      .add({
        action,
        groupId: groupId || null,
        deviceId,
        ts: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch(console.error);
  }

  try {
    const snapshot = await db.collection('sections').get();
    if (snapshot.empty) {
      groupsContainer.innerText = "No groups found.";
      return;
    }

    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data() || {};
      const name = data.name || id;
      const lastUpdated = data.lastUpdated ? data.lastUpdated.toMillis() : 0;
      const lastOpened =
        parseInt(localStorage.getItem(`lastOpened_${id}`)) || 0;

      const card = document.createElement('div');
      card.className = 'group-card';
      card.dataset.groupId = id;

      const nameEl = document.createElement('div');
      nameEl.className = 'group-name';
      nameEl.textContent = name;
      card.appendChild(nameEl);

      const dot = document.createElement('span');
      dot.className = 'notification-dot';
      dot.style.display =
        lastUpdated > lastOpened ? 'inline-block' : 'none';
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
    h.style.top = window.innerHeight + 40 + 'px';
    h.style.animation = `float ${4 + Math.random() * 3}s linear`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 7000);
  }

  setInterval(createHeart, 600);
});
