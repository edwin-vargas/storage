const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const fileList = document.createElement('ul');
const dropzoneText = dropzone.querySelector('p');
const uploadButton = document.getElementById('uploadButton');
const downloadList = document.getElementById('lista-archivos'); // Agrega la lista de descarga


//dropzone handler
//------------------------------------------------------------------------------------------------------------------

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
//------------------------------------------------------------------------------------------------------------------

// Sube el archivo
uploadButton.addEventListener('click', async () => {
    if (!fileInput.files.length) return;

    try {
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';

        const file = Array.from(fileInput.files[0]);  // Get the file from the input

        localStorage.setItem('name', 'edwin')
        userName = localStorage.getItem('name')

        const formData = new FormData();
        formData.append("name", userName); //from localStorage
        formData.append("file", file);

        fetch('https://localhost:3000/file', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.filePath) {
                document.getElementById('message').textContent = `File uploaded successfully! File saved at: ${data.filePath}`;
            } else {
                document.getElementById('message').textContent = `Error: ${data.message || 'Something went wrong'}`;
            }
        })
        .catch(error => {
            document.getElementById('message').textContent = `Error: ${error.message}`;
        });

    } catch (err) {
        console.log(err);
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = 'Subir';
    }
})