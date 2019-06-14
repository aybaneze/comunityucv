const google = document.getElementById('google');
const facebook = document.getElementById('facebook');
const facebook1= document.getElementById('facebook1');
const google1 = document.getElementById('google1');
const btnLogout=document.getElementById('botoncerrar');
const btnSignin=document.getElementById('btnSignin');
const registrar= document.getElementById('registrar');
const name= document.getElementById('name');
const pass= document.getElementById('pass');
const email1= document.getElementById('email1');
const email = document.getElementById('email');
const password = document.getElementById('password');
const Init= document.getElementById("Init");
const data = document.getElementById('data');
const Profile = document.getElementById('Profile');
const UserCount = document.getElementById('UserCount');


const state = {
    name: null,
}
const register = document.getElementById('register');
register.addEventListener('click',()=>{
    document.getElementById('outForm').style.display='block';
    document.getElementById('inForm').style.display='none';
})
const ingreso = document.getElementById('ingreso');
ingreso.addEventListener('click',()=>{
    document.getElementById('inForm').style.display='block';
    document.getElementById('outForm').style.display='none';
})
google.addEventListener('click',inGoogle)
facebook.addEventListener('click',inFacebook)
google1.addEventListener('click', inGoogle)
facebook1.addEventListener('click', inFacebook)
registrar.addEventListener('click', registerFunction)
btnSignin.addEventListener('click', signinFunction)
btnLogout.addEventListener('click', logoutFunction)

document.getElementById('muro').addEventListener('click', muro);
function muro() {
    window.location.href = 'indexMuro.html'
}