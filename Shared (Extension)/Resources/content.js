// Function to save an article to GitHub
function saveArticleToGitHub(articleContent) {
    const GITHUB_TOKEN = localStorage.getItem('githubToken'); // Retrieve the token from localStorage

    if (!GITHUB_TOKEN) {
        alert("GitHub token is missing!");
        return;
    }

    const repoOwner = 'atsokolas';
    const repoName = 'note_taker';
    const filePath = "screenshots/saved-article.txt";  // Adjust as necessary
    const commitMessage = "Saving new article";

    // Base64 encode the article content
    const encodedContent = btoa(unescape(encodeURIComponent(articleContent)));

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const requestData = {
        message: commitMessage,
        content: encodedContent
    };

    fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Successfully saved the article to GitHub:", data);
        alert("Article saved successfully!");
    })
    .catch(error => {
        console.error("Error saving article to GitHub:", error);
        alert("Error saving article: " + error.message);
    });
}

// Listen for messages to save the article
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveArticle") {
        console.log("Saving article...");

        // Example article content (replace with actual content from the page)
        const articleContent = "Sample article content";

        // Save the article
        saveArticleToGitHub(articleContent);

        sendResponse({ status: "Article saved successfully" });
    }
});
