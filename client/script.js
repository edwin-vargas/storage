const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const fileList = document.createElement('ul');
const dropzoneText = dropzone.querySelector('p');
const uploadButton = document.getElementById('uploadButton')

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
            e.stopPropagation(); // Evita que el evento click se propague
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

//inicio de codigo json-file-convert

uploadButton.addEventListener('click', async () => { 
    if (!fileInput.files.length) return;
    
    const file = fileInput.files[0];
    try {
        uploadButton.disabled = true;
        uploadButton.textContent = 'Uploading...';
        
        const base64String = await fileToBase64(file);
        console.log(base64String)
        
        const payload = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            folder: "frida",
            fileData: base64String
        };
        console.log(payload)
        
        await fetch('http://localhost:1234/file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = 'Upload File';
    }
});

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