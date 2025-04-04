document.addEventListener("DOMContentLoaded", async function () {
    const downloadList = document.getElementById("lista-archivos");

    // Function to fetch files
    async function fetchFiles() {
        try {
            const userName = localStorage.getItem('name');  // Retrieve the username from localStorage

            // Check if userName exists in localStorage
            if (!userName) {
                throw new Error("User not logged in. Name is missing from localStorage.");
            }

            const response = await fetch(`http://localhost:3000/files?name=${encodeURIComponent(userName)}`);

            if (!response.ok) {
                throw new Error("Error fetching files");
            }

            const data = await response.json();

            if (!data.files || data.files.length === 0) {
                downloadList.innerHTML = "<p>No files found.</p>";
                return;
            }

            // Clear existing list
            downloadList.innerHTML = "";

            // Create a list for files
            const fileList = document.createElement("ul");

            data.files.forEach(file => {
                const listItem = document.createElement("li");
                listItem.textContent = file.fileName;
                listItem.dataset.fileId = file.id; // Store the file ID

                // Add click event to each file item
                listItem.addEventListener("click", () => handleFileClick(file));

                fileList.appendChild(listItem);
            });

            downloadList.appendChild(fileList);
        } catch (error) {
            console.error("Error:", error);
            downloadList.innerHTML = "<p>Error loading files.</p>";
        }
    }

    // Function to handle file click
    function handleFileClick(file) {
        console.log(`File clicked: ${file.fileName} (ID: ${file.id}) (UserID: ${file.user_id})`);

        // Prepare the query string for the request
        const params = new URLSearchParams({
            user_id: file.user_id,
            fileName: file.fileName
        });

        // Fetch the file from the server with query parameters
        fetchFile(params);
    }

    // Function to fetch the actual file
    async function fetchFile(params) {
        try {
            const response = await fetch(`http://localhost:3000/file?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            const fileBlob = await response.blob();  // Get the file blob from the response

            // Create an object URL for the file
            const fileURL = URL.createObjectURL(fileBlob);

            // Create an invisible link and trigger a download
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = params.get('fileName'); // Set the file name for the download
            link.click();  // Trigger the download

            // Optional: Revoke the object URL after download
            URL.revokeObjectURL(fileURL);

        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    // Fetch files when the page loads
    fetchFiles();
});
