// Save the article content as a screenshot
function saveArticle() {
    const articleName = document.getElementById('articleName').value.trim();
    if (!articleName) {
        alert("Please enter an article name.");
        return;
    }

    console.log("Attempting to capture the screenshot");

    html2canvas(document.body).then(canvas => {
        console.log("Screenshot captured");
        const dataUrl = canvas.toDataURL('image/png');
        uploadToGitHub(articleName, dataUrl);
    }).catch(error => {
        console.error("Error capturing screenshot:", error);
        alert("Failed to capture the screenshot. Check the console for details.");
    });
}

// Upload screenshot to GitHub
function uploadToGitHub(articleName, dataUrl) {
    const username = 'atsokolas';
    const repo = 'note_taker';
    const branch = 'main'; // or whatever branch you want to use
    const filePath = `screenshots/${articleName}.png`;
    const message = `Add screenshot for ${articleName}`;
    const token = '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'; // This should be securely managed

    console.log("Uploading to GitHub");

    fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            content: dataUrl.split(',')[1], // Remove the data URL prefix
            branch: branch
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            console.log("Article saved successfully:", data.content);
            alert("Article saved successfully!");
        } else {
            console.error("Error saving article:", data.message);
            alert("Error saving article: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error saving article:", error);
        alert("Error saving article: " + error.message);
    });
}

// Load the list of saved articles
function loadArticles() {
    const savedArticlesList = document.getElementById('savedArticlesList');
    const savedArticleContainer = document.getElementById('savedArticleContainer');
    
    // Clear the list and article container
    savedArticlesList.innerHTML = '';
    savedArticleContainer.innerHTML = '';

    // Fetch the list of files from the GitHub repository
    const username = 'atsokolas';
    const repo = 'note_taker';
    const branch = 'main'; // or whatever branch you want to use
    const token = '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'; // make sure to keep this secret

    fetch(`https://api.github.com/repos/${username}/${repo}/contents/screenshots?ref=${branch}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(files => {
        files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name.replace('.png', '');
            listItem.addEventListener('click', () => {
                savedArticleContainer.innerHTML = `<img src="${file.download_url}" alt="${file.name}">`;
            });
            savedArticlesList.appendChild(listItem);
        });
    })
    .catch(error => {
        alert("Error loading articles: " + error.message);
    });
}

// Add event listeners to the buttons
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveArticleButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveArticle);
    } else {
        console.log("Save Article button not found");
    }

    const loadButton = document.getElementById('loadArticleButton');
    if (loadButton) {
        loadButton.addEventListener('click', loadArticles);
    } else {
        console.log("Load Article button not found");
    }
});
