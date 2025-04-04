let user = localStorage.getItem('name')
if (!user) {
    window.location.href = 'sing_in.html';
} else {
    console.log('el usuario esta logeado correctamente')
}