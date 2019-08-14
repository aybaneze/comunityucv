window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if(user){
            userActive(user)
        }
    })
    }
  
   function userActive(user){
        firebase.database().ref('freww/').once('value').then(function (snapshot) {
          Object.keys(snapshot.val()).map(item =>{
             if(snapshot.val()[item].active === 'si'){
               let chat = document.getElementById('js-chat-content');
                chat.innerHTML +=`<a href="#" id='js-chat' onClick="newChat()"> <div class="personal-chat"><img src="${snapshot.val()[item].foto}" /><span class="circle-active">0</span><p>${snapshot.val()[item].nombre}</p></div></a>`
             }
          }         
            )
        })
      }

      var chatKey = '';
  
   function newChat(){
        var id =firebase.auth().currentUser.uid
        var postData = {
          uid: id,
          hour: window.Date().slice(4,21)
        //   photo: globalPhoto,
        //   name: globalName 
      };
          // Get a key for a new Post.
          var newChatUser = firebase.database().ref().child('chats').push().key;  
          console.log(newChatUser)
          // Write the new post's data simultaneously in the posts list and the user's post list.
          var updates = {};
          updates['/chat/' + id+'/'+ newChatUser] = postData;
          // updates['/posts/' + uid + '/' + newPostKey] = postData;
  
      firebase.database().ref().update(updates);
      return newChatUser;
  }