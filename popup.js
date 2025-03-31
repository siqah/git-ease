
const GITHUB_TOKEN = "your_github_token_here"; // Replace with your GitHub token
const API_URL = "https://api.github.com/graphql";

document.getElementById("searchButton").addEventListener("click", async () => {
  const queryText = document.getElementById("searchInput").value.trim();
  const searchType = document.getElementById("searchType").value;
  const language = document.getElementById("languageSelect").value;
  const minStars = document.getElementById("minStars").value;
  const sortOption = document.getElementById("sortSelect").value;


  if (!queryText) return alert("Please enter a search term!");

  let searchQuery = `${queryText}`;

  if (language && searchType === "repository") searchQuery += ` language:${language}`;
  if (minStars && searchType === "repository") searchQuery += ` stars:>${minStars}`;

  let sortQuery = "";
  if (sortOption === "stars-desc") sortQuery = "sort:stars-desc";
  else if (sortOption === "stars-asc") sortQuery = "sort:stars-asc";

  let gqlQuery = "";

  if (searchType === "repository") {
    gqlQuery = `
      query {
        search(query: "${searchQuery} ${sortQuery}", type: REPOSITORY, first: 5) {
          nodes {
            ... on Repository {
              name
              url
              stargazerCount
              owner {
                login
              }
            }
          }
        }
      }
    `;
  } else if (searchType === "issue") {
    gqlQuery = `
      query {
        search(query: "${searchQuery}", type: ISSUE, first: 5) {
          nodes {
            ... on Issue {
              title
              url
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    `;
  } else if (searchType === "pr") {
    gqlQuery = `
      query {
        search(query: "${searchQuery}", type: ISSUE, first: 5) {
          nodes {
            ... on PullRequest {
              title
              url
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    `;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({ query: gqlQuery })
    });

    const data = await response.json();
    displayResults(data.data.search.nodes, searchType);
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    alert("Failed to fetch data. Check your API token.");
  }
});

function displayResults(items, type) {
  const resultsList = document.getElementById("results");
  resultsList.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    if (type === "repository") {
      li.innerHTML = `<a href="${item.url}" target="_blank">${item.name} by ${item.owner.login} ⭐ ${item.stargazerCount}</a>
        <button class="bookmark-btn" data-url="${item.url}" data-name="${item.name}">⭐ Bookmark</button>`;
    } else {
      li.innerHTML = `<a href="${item.url}" target="_blank">${item.title} (${item.repository.nameWithOwner})</a>`;
    }
    resultsList.appendChild(li);
  });

  document.querySelectorAll(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const repo = {
        name: btn.getAttribute("data-name"),
        url: btn.getAttribute("data-url")
      };
      saveBookmark(repo);
    });
  });
}

// Save bookmarks to localStorage
function saveBookmark(repo) {
  let bookmarks = JSON.parse(localStorage.getItem("githubBookmarks")) || [];
  if (!bookmarks.some(b => b.url === repo.url)) {
    bookmarks.push(repo);
    localStorage.setItem("githubBookmarks", JSON.stringify(bookmarks));
    loadBookmarks();
  }
}

// Load bookmarks from localStorage
function loadBookmarks() {
  const bookmarksList = document.getElementById("bookmarks");
  bookmarksList.innerHTML = "";
  let bookmarks = JSON.parse(localStorage.getItem("githubBookmarks")) || [];

  bookmarks.forEach(repo => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${repo.url}" target="_blank">${repo.name}</a>
      <button class="remove-bookmark" data-url="${repo.url}">❌</button>`;
    bookmarksList.appendChild(li);
  });

  document.querySelectorAll(".remove-bookmark").forEach(btn => {
    btn.addEventListener("click", () => {
      removeBookmark(btn.getAttribute("data-url"));
    });
  });
}

// Remove bookmark from localStorage
function removeBookmark(url) {
  let bookmarks = JSON.parse(localStorage.getItem("githubBookmarks")) || [];
  bookmarks = bookmarks.filter(repo => repo.url !== url);
  localStorage.setItem("githubBookmarks", JSON.stringify(bookmarks));
  loadBookmarks();
}

// Load bookmarks on popup open
document.addEventListener("DOMContentLoaded", loadBookmarks);
document.addEventListener("DOMContentLoaded", function () {
  const templateList = document.getElementById("templateList");
  const newTemplateInput = document.getElementById("newTemplate");
  const addTemplateButton = document.getElementById("addTemplate");

  function loadTemplates() {
      const templates = JSON.parse(localStorage.getItem("prTemplates")) || [];
      templateList.innerHTML = "";
      templates.forEach((template, index) => {
          const li = document.createElement("li");
          li.textContent = template;
          li.style.cursor = "pointer";
          li.onclick = () => selectTemplate(template);

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "X";
          deleteButton.style.marginLeft = "10px";
          deleteButton.onclick = (event) => {
              event.stopPropagation();
              deleteTemplate(index);
          };

          li.appendChild(deleteButton);
          templateList.appendChild(li);
      });
  }

  function addTemplate() {
      const newTemplate = newTemplateInput.value.trim();
      if (!newTemplate) return;
      
      const templates = JSON.parse(localStorage.getItem("prTemplates")) || [];
      templates.push(newTemplate);
      localStorage.setItem("prTemplates", JSON.stringify(templates));
      newTemplateInput.value = "";
      loadTemplates();
  }

  function deleteTemplate(index) {
      const templates = JSON.parse(localStorage.getItem("prTemplates")) || [];
      templates.splice(index, 1);
      localStorage.setItem("prTemplates", JSON.stringify(templates));
      loadTemplates();
  }

  function selectTemplate(template) {
      chrome.storage.sync.set({ selectedPRTemplate: template }, () => {
          alert("Template selected! It will be used in PRs.");
      });
  }

  addTemplateButton.addEventListener("click", addTemplate);
  loadTemplates();
});

//template code 
document.addEventListener("DOMContentLoaded", function () {
  const giteasebuttonBtn = document.getElementById("giteasebutton");

  if (giteasebuttonBtn ) {  // ✅ Check if the element exists
       giteasebuttonBtn .addEventListener("click", function () {
          chrome.tabs.create({ url: chrome.runtime.getURL("dashboard/index.html") });
      });
  } else {
      console.error("Button with id 'openTemplates' not found!");
  }
});






