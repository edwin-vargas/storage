const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const fileList = document.createElement('ul');
const dropzoneText = dropzone.querySelector('p');
const uploadButton = document.querySelector('.button2 .subir');

dropzone.appendChild(fileList);

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

            // Simulación de respuesta del servidor con Base64
            const response = {
                fileData: base64String, // Base64 del archivo recibido
                fileName: file.name,
                fileType: file.type
            };

            // Convertir Base64 a archivo
            const convertedFile = base64ToFile(response.fileData, response.fileName, response.fileType);

            // Crear un enlace de descarga para el archivo convertido
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(convertedFile);
            downloadLink.download = response.fileName;
            downloadLink.textContent = `Descargar ${response.fileName}`;

            // Agregar el enlace de descarga a la lista de archivos
            const listItem = document.createElement('li');
            listItem.appendChild(downloadLink);
            fileList.appendChild(listItem);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        uploadButton.disabled = false;
        uploadButton.value = 'Subir';
    }
});

function displayFiles(files) {
    dropzoneText.style.display = 'none';
    fileList.innerHTML = '';
    for (const file of files) {
        const listItem = document.createElement('li');
        listItem.textContent = file.name;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile(file);
        });

        listItem.appendChild(deleteButton);
        fileList.appendChild(listItem);
    }
}

function removeFile(fileToRemove) {
    const newFiles = Array.from(fileInput.files).filter(file => file !== fileToRemove);
    Object.defineProperty(fileInput, 'files', {
        value: toDataTransfer(newFiles),
        writable: true,
        configurable: true
    });
    displayFiles(fileInput.files);

    if (fileInput.files.length === 0) {
        dropzoneText.style.display = 'block';
    }
}

function toDataTransfer(files) {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}

function base64ToFile(base64String, fileName, fileType) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: fileType });
    return new File([blob], fileName, { type: fileType });
}