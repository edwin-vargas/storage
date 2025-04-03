const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const fileList = document.createElement('ul');
const dropzoneText = dropzone.querySelector('p');
const uploadButton = document.querySelector('.button2 .subir');
const downloadList = document.createElement('ul'); // Lista para enlaces de descarga

dropzone.appendChild(fileList);
dropzone.appendChild(downloadList); // Agregar la lista de descarga al dropzone

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    fileInput.files = e.dataTransfer.files;
    displayFiles(e.dataTransfer.files);
});

dropzone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    displayFiles(fileInput.files);
});

uploadButton.addEventListener('click', async () => {
    if (!fileInput.files.length) return;

    try {
        uploadButton.disabled = true;
        uploadButton.value = 'Uploading...';

        const files = Array.from(fileInput.files);
        for (const file of files) {
            const base64String = await fileToBase64(file);

            const payload = {
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileData: base64String
            };

            // Subida real al servidor (reemplaza '/api/upload' con tu endpoint)
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }

            const responseData = await response.json();

            // Convertir Base64 a archivo (si el servidor devuelve la cadena Base64)
            const convertedFile = base64ToFile(responseData.fileData, responseData.fileName, responseData.fileType);

            // Crear enlace de descarga
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(convertedFile);
            downloadLink.download = responseData.fileName;
            downloadLink.textContent = `Descargar ${responseData.fileName}`;

            const listItem = document.createElement('li');
            listItem.appendChild(downloadLink);
            downloadList.appendChild(listItem);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        uploadButton.disabled = false;
        uploadButton.value = 'Subir';
    }
});

// ... (funciones displayFiles, removeFile, toDataTransfer, fileToBase64, base64ToFile)