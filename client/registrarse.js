// Esperar a que el DOM cargue completamente antes de adjuntar manejadores
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita el recargo de la página

        // Capturar los valores del formulario
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validación de contraseña
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Crear el objeto con los datos del usuario
        const userData = {
            name,
            email,
            password
        };

        try {
            // Hacer la petición `fetch` al backend
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Convertir la respuesta a JSON
            const data = await response.json();

            if (response.ok) {
                console.log('✅ Usuario registrado:', data);

                // Mostrar el modal de éxito
                document.getElementById('success-modal').style.display = 'block';

                localStorage.setItem('name', data.user)

                // Redirigir al inicio de sesión después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'sing_in.html';
                }, 2000);
            } else {
                console.error('❌ Error en el registro:', data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('❌ Error en la petición:', error);
            alert('Error al conectar con el servidor. Inténtalo más tarde.');
        }
    });
});
