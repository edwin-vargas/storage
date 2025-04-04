// Wait for the DOM to be fully loaded before attaching handlers
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        // Grab form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Log values to the console
        console.log('Nombre:', name);
        console.log('Correo electrónico:', email);
        console.log('Contraseña:', password);
        console.log('Confirmar contraseña:', confirmPassword);

        // Optional: validate or show a modal
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Show success modal (optional)
        const modal = document.getElementById('success-modal');
        modal.style.display = 'block';
        
    });
});
