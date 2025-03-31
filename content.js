
(async function () {
    function isPullRequestPage() {
      return window.location.pathname.includes('/compare') || window.location.pathname.includes('/pull/new');
    }
  
    async function fetchPRTemplate(owner, repo) {
      const possiblePaths = [
        '.github/PULL_REQUEST_TEMPLATE.md',
        'docs/PR_TEMPLATE.md',
        'PULL_REQUEST_TEMPLATE.md'
      ];
  
      for (const path of possiblePaths) {
        try {
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
          if (response.ok) {
            const data = await response.json();
            return atob(data.content); 
          }
        } catch (error) {
          console.error('Error fetching PR template:', error);
        }
      }
      return null; 
    }
  
    function insertTemplate(template) {
      const textarea = document.querySelector('textarea[name="pull_request[body]"]');
      if (textarea && template) {
        textarea.value = template;
      }
    }
  
    function addApplyTemplateButton(template) {
      const textarea = document.querySelector('textarea[name="pull_request[body]"]');
      if (!textarea) return;
      
      const button = document.createElement('button');
      button.innerText = 'Apply PR Template';
      button.style.margin = '10px';
      button.onclick = () => insertTemplate(template);
      
      textarea.parentNode.insertBefore(button, textarea);
    }
  
    async function init() {
      if (!isPullRequestPage()) return;
      
      const [owner, repo] = window.location.pathname.split('/').slice(1, 3);
      let template = await fetchPRTemplate(owner, repo);
      
      if (!template) {
        template = localStorage.getItem('customPRTemplate') || 'Default PR Template: Describe your changes here.';
      }
      
      insertTemplate(template);
      addApplyTemplateButton(template);
    }
  
    document.addEventListener('DOMContentLoaded', init);
  })();
  
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "insertTemplate") {
            let textarea = document.querySelector("textarea");
            if (textarea) {
                textarea.value = request.template;
            }
        }
    });
    