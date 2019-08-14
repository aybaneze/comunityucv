$( ".inp-form" ).focus(function() {
    $( ".inp label ")
  });

let globalPhoto;
let globalName;

window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            data.classList.remove("hiden");
            Init.classList.add("hiden");
            nav.classList.remove("hiden");
            $('.Profile').append("<img class='profile-img' style='height:140px;width:140px;border-radius:10px;float:center;border:5px solid #fff;' src='" + user.photoURL + "'/>");
            globalPhoto = user.photoURL;
            globalName = user.displayName;
            UserCount.innerHTML = "<p>" + user.displayName + "</p>";  
            valposteos(); 
        } else {
            Init.classList.remove("hiden");
            data.classList.add('hiden');  
            nav.classList.add('hiden'); 
        }  
  
    });

}

function guardaDatos(user) {
    var usuario = {
        uid: user.uid,
        nombre: user.displayName,
        email: user.email,
        foto: user.photoURL,
        active: 'si',
    }
    firebase.database().ref('freww/' + user.uid)
        .set(usuario)
}

const registerFunction = () => {
    if (email1.value !== '' && pass.value !== '' && name.value !== '') {
        if (/^[a-zA-Z0-9._-]+@+[a-z]+.+[a-z]/.test(email1.value)) {
            firebase.auth().createUserWithEmailAndPassword(email1.value, pass.value)
                .then(function () {
                    state.name = name.value;
                    guardaDatos(result.user);
                    console.log('se creo el usuario');
                    alert("Usted está registradx")
                })
                .catch(function (error) {
                    console.log(error.code, error.message);
                    alert(error.message)
                });
        }
        else {
            alert("correo electronico incorrecto");
        }
    }
    else {
        alert("debe llenar los campos vacios obligatoriamente");
    }
}

const signinFunction = () => {
    if (email.value !== '' && password.value !== '') {
        if (/^[a-zA-Z0-9._-]+@+[a-z]+.+[a-z]/.test(email.value)) {
            firebase.auth().signInWithEmailAndPassword(email.value, password.value)
                .then(function () {
                    guardaDatos(result.user);
                    console.log('inicio sesión');
                })
                .catch(function (error) {
                    console.log(error.code, error.message)
                    alert(error.message)
                });
        }
        else {
            alert("correo electronico incorrecto");
        }

    } else {
        alert("debe llenar los campos vacios obligatoriamente")
    }
}

const logoutFunction = () => {
    firebase.auth().signOut().then(function (out) {
        console.log(out);
        // Init.classList.remove('hiden');
        // data.classList.add('hiden');
        // nav.classList.add('hiden');
    }).catch(function (error) {
        console.log('error al cerrar sesion');
    })
}

const inGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        guardaDatos(result.user);
        console.log('inicie sesion con google');
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        // ...
    });
}

const inFacebook = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider).then(function (result) {
        guardaDatos(result.user);
        console.log('inicie sesion con facebook')
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}


let postKeyUpdate = '';

function writeNewPost(uid, body) {
    console.log('write');
    // A post entry.
    var postData = {
        uid: uid,
        body: body,
        likeCount: 0,
        hour: window.Date().slice(4,21),
        photo: globalPhoto,
        name: globalName 

    };

    if (postKeyUpdate == '') {
        // Get a key for a new Post.
        var newPostKey = firebase.database().ref().child('posts').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/posts/' + uid + '/' + newPostKey] = postData;
    }
    else {
        var updates = {};
        updates['/posts/'+ uid + '/' +  postKeyUpdate] = postData;
        postKeyUpdate = '';
    }
    firebase.database().ref().update(updates);
    return newPostKey;

}


function removePost(itemId,postkey) {
    var uid = firebase.auth().currentUser.uid;
    if(itemId === uid){
         let path = '/posts/'+itemId+ '/' + postkey;
    firebase.database().ref(path).remove().then(function () {
        valposteos();
        alert("desea eliminar su comentario")
    })
        .catch(function (error) {
            console.log("ERROR PE: " + error.message)
        });

    }
   
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
    var userId = firebase.auth().currentUser.uid;
    const promesita = firebase.database().ref('/posts').once('value');
    const posteos = promesita.then(function (snapshot) {
        Object.keys(snapshot.val()).map(item => {
            objSubPost = Object.keys(snapshot.val()[item])
            const p = document.createElement('p');
            for(let i = 0; i < objSubPost.length ; i++){  
                if(userId ===item){     
            p.innerHTML += `
                    <div class="card-publish-user"><br>
                    <div class="info-card"><img src="${snapshot.val()[item][objSubPost[i]].photo}" style="width:40px;height:40px;border-radius:10px; margin-right:15px"><p>${snapshot.val()[item][objSubPost[i]].name}</p></div>
                    <span class="w3-right w3-opacity" style="font-size: 10px;">${snapshot.val()[item][objSubPost[i]].hour}</span>
                    <div><p style="font-size:20px;"></p></div>
                    <div style="font-size:20px;" id=${item}>${snapshot.val()[item][objSubPost[i]].body}</div><br>
                    <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick ="like('${item}','${objSubPost[i]}')"><i class="far fa-thumbs-up"></i> Me Gusta ${snapshot.val()[item][objSubPost[i]].likeCount}</button> 
                    <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "removePost('${item}','${objSubPost[i]}')"><i class="far fa-trash-alt"></i> ELIMINAR</button>         
                    <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick = "editPost('${item}','${objSubPost[i]}')"><i class="far fa-edit"></i>EDITAR</button>
                    </div>
                    </div> 
                    </div><br>`;
                    }else{
                        p.innerHTML += `
                        <div class="card-publish-user"><br>
                        <div class="info-card"><img src="${snapshot.val()[item][objSubPost[i]].photo}" style="width:40px;height:40px;border-radius:10px; margin-right:15px"><p>${snapshot.val()[item][objSubPost[i]].name}</p></div>
                        <span class="w3-right w3-opacity" style="font-size: 10px;">${snapshot.val()[item][objSubPost[i]].hour}</span>
                        <div><p style="font-size:20px;"></p></div>
                        <div style="font-size:20px;" id=${item}>${snapshot.val()[item][objSubPost[i]].body}</div><br>
                        <button class="w3-button w3-theme-d1 w3-margin-bottom" onclick ="like('${item}','${objSubPost[i]}')"><i class="far fa-thumbs-up"></i> Me Gusta ${snapshot.val()[item][objSubPost[i]].likeCount}</button>
                        </div>
                        </div> 
                        </div><br>`;
                    }
                   
            }         
            div.appendChild(p)
          return  content.appendChild(div)
        })
        return snapshot.val();
    });

}


function like(item) {
    let postIds= firebase.database().ref('posts/'+ item); 
    postIds.transaction(function(element){
        console.log(element)
     if(element){
         element.likeCount++; 
        window.location.reload(true);
     }
     return element;
    })     
}

postPrivate.addEventListener('click', () => {
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


