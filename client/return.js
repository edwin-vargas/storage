const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const fileList = document.createElement('ul');
const dropzoneText = dropzone.querySelector('p');
const uploadButton = document.querySelector('.button2 .subir');
const downloadList = document.getElementById('lista-archivos'); // Cambiamos a lista-archivos

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

            const response = await fetch('/api/upload', { // Reemplaza '/api/upload' con tu endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }

            const responseData = await response.json();

            const convertedFile = base64ToFile(responseData.fileData, responseData.fileName, responseData.fileType);

            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(convertedFile);
            downloadLink.download = responseData.fileName;
            downloadLink.textContent = `Descargar ${responseData.fileName}`;

            const listItem = document.createElement('li');
            listItem.appendChild(downloadLink);
            downloadList.appendChild(listItem); // Usamos downloadList
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        uploadButton.disabled = false;
        uploadButton.value = 'Subir';
    }
});

// ... (funciones displayFiles, removeFile, toDataTransfer, fileToBase64, base64ToFile)