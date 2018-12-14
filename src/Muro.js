
document.getElementById('perfil').addEventListener('click', perfil);
function perfil() {
    window.location.href = 'index.html'
}


window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Inicio sesion srta')
        } else {
        
        }
        valposteos()
    });

}

document.getElementById('botoncerrar').addEventListener('click', ()=>{
    firebase.auth().signOut().then(function () {
        console.log('cerraste Sesion srta')
        location.href="index.html"
    }).catch(function (error) {
        console.log('error al cerrar sesion');
    })
})

let postKeyUpdate = '';

function writeNewPost(uid, body) {
    console.log('write');
    // A post entry.
    var postData = {
        uid: uid,
        body: body,
        likeCount: 0,

    };

    if (postKeyUpdate == '') {
        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('user-posts').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/user-posts/' + newPostKey] = postData;
        updates['/posts/' + uid + '/' + newPostKey] = postData;
    }
    else {
        var updates = {};
        updates['/user-posts/'+  newPostKey] = postData;
     updates['/posts/' + uid + '/' + newPostKey] = postData;
        postKeyUpdate = '';
    }
    firebase.database().ref().update(updates);
    return newPostKey;

}


function removePost(postkey) {
    let uid = firebase.auth().currentUser.uid;
    let path = '/posts/' + uid + '/' + postkey;
    let path = '/user-posts/' + postKey;
    console.log(path)
    firebase.database().ref(path).remove().then(function () {
        valposteos();
        alert("desea eliminar su comentario")
    })
        .catch(function (error) {
            console.log("ERROR PE: " + error.message)
        });

}

function editPost(postkey) {
    let uid = firebase.auth().currentUser.uid;
    let path = '/posts/' + uid + '/' + postkey;
    let promise = firebase.database().ref(path).once('value');

    promise.then(snapshot => {
        postKeyUpdate = postkey;      
        let msg = snapshot.val().body;     
        post.value = msg;
        console.log(post)

    })
}

let post = document.getElementById('post');
let content = document.getElementById('content');
const botonpostea = document.getElementById('botonpostea');

const div = document.createElement('div');
function valposteos() {
   while (div.firstChild) div.removeChild(div.firstChild);
    let promise = firebase.database().ref().child('user-posts').once('value');
     console.log(promise)
      let posteos = promise.then(function (snapshot) {
        Object.keys(snapshot.val()).map(item => {
          
            const p = document.createElement('p');
            p.innerHTML = `
                    <div class="w3-container w3-card w3-white w3-round w3-margin" style="width:90%;"><br>
                    <div><img src="../imagenes/logoWeb.png" id="logoWeb"  style="width:30%;heigth:20%;"></div>
                    <span class="w3-right w3-opacity">16 min</span>
                    <div><p style="font-size:20px;"></p></div>
                    <div style="font-size:20px;" id=${item}>${snapshot.val()[item].body}</div><br>
                    <hr class="w3-clear">
                    <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick ="like('${item}')"><i class="far fa-thumbs-up"></i> Me Gusta ${snapshot.val()[item].likeCount}</button>  
                    <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "removePost('${item}')"><i class="far fa-trash-alt"></i> ELIMINAR</button>         
                    <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "editPost('${item}')"><i class="far fa-edit"></i>EDITAR</button>
                    </div>
                    </div> 
                    </div><br>`;
            return div.appendChild(p)
        })
        return snapshot.val();
    });
    console.log(posteos);
}


function like(postkey) {
    let postIds= firebase.database().ref('/user-posts/' + postkey); 
    postIds.transaction(function(element){
        console.log(element)
     if(element){
         element.likeCount++; 
        window.location.reload(true);
     }
     return element;
    })  
    
}


//console.log(valposteos());
content.appendChild(div)
botonpostea.addEventListener('click', () => {
    let textVacio = post.value.trim();
    console.log(textVacio)
   if(post.value != '' && textVacio != "" ){
       console.log('entra al evento')
       var userId = firebase.auth().currentUser.uid;
       const newPost = writeNewPost(userId, post.value);
       valposteos();
       post.value ='';
       return 'creo';
   }
   else{
       alert("Para publicar debes poner texto");
   }
   });
   
