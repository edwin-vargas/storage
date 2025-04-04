//primero descomenta esta linea y checa f12 en la pagina
// localStorage.setItem('userName', 'edwin')

//comenta la linea anterior y descomenta esta linea deberia redirigirte a iniciar sesion
localStorage.removeItem('userName')

console.log(localStorage.getItem('userName'))

let user = localStorage.getItem('userName')
if (!user) {
    window.location.href = 'iniciarSesion.html';
} else {
    console.log('el usuario esta logeado correctamente')
}