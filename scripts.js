document.addEventListener("DOMContentLoaded", () => {

  // ------------------ Floating Hearts ------------------
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
  setInterval(createHeart, 600);

  // ------------------ Dynamic Menu ------------------
  const groups = [
    { id: "whyIAmTheOne", name: "Why I Am the One for You 💕" },
    { id: "whyYouAreTheOne", name: "Why You’re the One for Me 💜" },
    { id: "thingsAboutYou", name: "100 Things You Should Know About Yourself 🌸" },
    { id: "thingsICouldNeverTell", name: "100 Things I Could Never Tell You 🌙" }
  ];

  const menuContainer = document.getElementById("menuContainer");

  if(!menuContainer){
    console.error("Menu container not found!");
    return;
  }

  // Populate menu: **all links go to universal group.html**
  groups.forEach(g=>{
    const a = document.createElement("a");
    a.href = `group.html?id=${g.id}`; // Pass group ID via query param
    a.className = "menu-item";
    a.textContent = g.name;
    menuContainer.appendChild(a);
  });

});
