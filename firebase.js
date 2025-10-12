// firebase.js
// Firebase 8.3.2 initialization

var firebaseConfig = {
  apiKey: "AIzaSyBOmm5l-irq0K9FfYi2soctX1fetc613Rc",
  authDomain: "yuta-f0c26.firebaseapp.com",
  projectId: "yuta-f0c26",
  storageBucket: "yuta-f0c26.firebasestorage.app",
  messagingSenderId: "947699204653",
  appId: "1:947699204653:web:1f530ffc40c4f58c63aea4"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
window.db = firebase.firestore();

(function(){
  function makeId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  if (!localStorage.getItem('deviceId')) {
    localStorage.setItem('deviceId', makeId());
  }
  window.getDeviceId = function() { return localStorage.getItem('deviceId'); };
})();
