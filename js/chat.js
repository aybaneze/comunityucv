window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if(user){
            userActive(user)
        }
    })
  
    }

   var a = firebase.auth().currentUser
   console.log(a)
  
   function userActive(user){
        firebase.database().ref('freww/').once('value').then(function (snapshot) {
          Object.keys(snapshot.val()).map(item =>{
             if(snapshot.val()[item].active === 'si'){
               let chat = document.getElementById('js-chat-content');
                chat.innerHTML=`<div class="personal-chat"><img src="${snapshot.val()[item].foto}" /><span class="circle-active">0</span><p>${snapshot.val()[item].nombre}</p></div>`
             }
          }         
            )
        })
      }