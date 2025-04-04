//non final download file creation link

const response = await fetch('http://localhost:1234/file', { // Reemplaza con tu endpoint xds
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
});

if (!response.ok) {
    throw new Error('Error al subir el archivo');
}

const responseData = await response.json();

const downloadLink = document.createElement('a');
downloadLink.href = URL.createObjectURL(convertedFile);
downloadLink.download = responseData.fileName;
downloadLink.textContent = `Descargar ${responseData.fileName}`;

const listItem = document.createElement('li');
listItem.appendChild(downloadLink);
downloadList.appendChild(listItem); // Agrega el enlace a la lista de descarga