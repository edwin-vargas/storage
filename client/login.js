document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que la página se recargue

        // Obtener valores de los campos
        const email = document.querySelector("input[type='email']").value.trim();
        const password = document.querySelector("input[type='password']").value.trim();

        if (!email || !password) {
            alert("Por favor, ingresa tu correo y contraseña.");
            return;
        }

        // Crear el objeto con los datos
        const loginData = { email, password };

        try {
            // Enviar la solicitud al servidor
            console.log("Enviando datos:", loginData);

            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            const data = await response.json(); // Convertir respuesta a JSON
            console.log("Respuesta del servidor:", data);

            if (!response.ok) {
                throw new Error(data.message || "Error en la autenticación");
            }

            // Mostrar información del usuario en la consola
            console.log("Usuario autenticado:", data.user);

            // Guardar usuario en localStorage
            localStorage.setItem('name', data.user.name);

            // Redireccionar si la autenticación es correcta
            window.location.href = "inicio.html";

        } catch (error) {
            console.error("Error en la autenticación:", error);
            alert(error.message);
        }
    });
});
