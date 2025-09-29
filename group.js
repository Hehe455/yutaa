// group.js

// Read ?id=groupId from URL
const params = new URLSearchParams(window.location.search);
const groupId = params.get("id") || "whyIAmTheOne"; // default

// Optional: map for titles
const groupTitles = {
  whyIAmTheOne: "Why I Am the One for You 💕",
  whyYouAreTheOne: "Why You’re the One for Me 💜",
  thingsAboutYou: "100 Things You Should Know About Yourself 🌸",
  thingsICouldNeverTell: "100 Things I Could Never Tell You 🌙"
};
document.getElementById("groupTitle").textContent = groupTitles[groupId] || "Group 💜";

// Floating hearts
function createHeart(){
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerHTML = "💜";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 25 + 40 + "px";
  heart.style.animationDuration = (Math.random() * 3 + 7) + "s";
  document.body.appendChild(heart);
  setTimeout(()=>heart.remove(),10000);
}
setInterval(createHeart,600);

// Fetch Firestore items for this group
const itemsContainer = document.getElementById("itemsContainer");
db.collection("sections").doc(groupId).get().then(doc=>{
  if(doc.exists){
    const items = doc.data().items || [];
    items.forEach(txt=>{
      const div = document.createElement("div");
      div.className = "menu-item";
      div.textContent = txt;
      itemsContainer.appendChild(div);
    });
  }
});
