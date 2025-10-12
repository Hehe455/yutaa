document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get('id');
  if (!groupId) { alert('Group not specified'); return; }

  const deviceId = window.getDeviceId();
  const itemsContainer = document.getElementById('itemsContainer');
  const groupTitle = document.getElementById('groupTitle');
  const homeBtn = document.getElementById('homeBtn');
  homeBtn.addEventListener('click', ()=> window.location.href = 'index.html');

  async function logAnalytics(action, extra) {
    await db.collection('analytics').add({
      deviceId,
      action,
      groupId,
      extra: extra || null,
      ts: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  await logAnalytics('group_page_load');

  // fetch articles
  const docSnap = await db.collection('sections').doc(groupId).get();
  if (!docSnap.exists) { itemsContainer.innerText = 'Group not found'; return; }
  const groupDoc = docSnap.data();
  groupTitle.textContent = groupDoc.name || groupId;
  const items = Array.isArray(groupDoc.items) ? groupDoc.items.slice().reverse() : [];

  async function fetchFavorites() {
    const favSnap = await db.collection('users')
      .doc(deviceId)
      .collection('favorites')
      .where('groupId','==',groupId)
      .orderBy('favoritedAt','desc')
      .get();
    return favSnap.docs.map(d => d.data().text);
  }

  function makeCard(text, fav=false){
    const c = document.createElement('div');
    c.className = 'list-card' + (fav ? ' favorite-glow' : '');
    c.innerHTML = `<div class="item-text">${text}</div>${fav ? '<div class="star">⭐</div>' : ''}`;

    let lastTap = 0;
    c.addEventListener('dblclick', ()=> toggleFavorite(text));
    c.addEventListener('touchend', (e)=>{
      const now = Date.now();
      if(now - lastTap < 400) toggleFavorite(text);
      lastTap = now;
    });
    return c;
  }

  async function toggleFavorite(text){
    const favRef = db.collection('users').doc(deviceId).collection('favorites');
    const q = await favRef.where('groupId','==',groupId).where('text','==',text).get();
    if(!q.empty){
      const batch = db.batch();
      q.forEach(s => batch.delete(s.ref));
      await batch.commit();
      await logAnalytics('favorite_removed',{text});
    } else {
      await favRef.add({
        groupId,
        text,
        favoritedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await logAnalytics('favorite_added',{text});
    }
    render();
  }

  async function render(){
    const favs = await fetchFavorites();
    const favSet = new Set(favs);
    itemsContainer.innerHTML = '';
    // favorites first
    favs.forEach(f => itemsContainer.appendChild(makeCard(f,true)));
    // then remaining items
    items.filter(i => !favSet.has(i)).forEach(i => itemsContainer.appendChild(makeCard(i,false)));
  }

  render();

  // hearts animation
  function createHeart() {
    const h = document.createElement('div');
    h.className = 'heart';
    h.style.left = Math.random()*window.innerWidth+'px';
    h.style.top = (window.innerHeight+30)+'px';
    h.style.animation = `float ${4+Math.random()*3}s linear`;
    document.body.appendChild(h);
    setTimeout(()=>h.remove(),7000);
  }
  setInterval(createHeart,600);
});
