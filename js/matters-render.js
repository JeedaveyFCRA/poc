// matters-render.js
// Modular renderer for the Matters box content

const MattersRenderer = (function () {
  let renderTimeout = null;
  
  async function render(id) {
    console.log('🎯 MattersRenderer.render called with ID:', id);
    
    // Clear any pending renders
    if (renderTimeout) {
      clearTimeout(renderTimeout);
    }
    
    const container = document.getElementById("matters-pointer-box");
    console.log('📦 Content container:', container ? 'found' : 'not found');
    
    if (!container) {
      console.error('❌ Container #matters-pointer-box not found!');
      console.log('🔍 Available elements with similar IDs:', 
        Array.from(document.querySelectorAll('[id*=matter], [id*=Matter]'))
          .map(el => ({ id: el.id, display: el.style.display }))
      );
      return;
    }

    // Show loading state
    container.innerHTML = '<div class="matters-loading">Loading...</div>';
    console.log('⌛ Loading state displayed');

    try {
      // Load matters-content.json
      console.log('📡 Fetching matters-content.json...');
      const mattersResponse = await fetch("data/matters-content.json");
      const mattersData = await mattersResponse.json();
      
      // If content exists in matters-content.json, use it
      if (mattersData[id]) {
        console.log('📋 Found content in matters-content.json for ID:', id);
        renderMattersContent(container, mattersData[id]);
        return;
      }
      
      // If content not found, show error
      console.warn('⚠️ No content found for ID:', id);
      container.innerHTML = `
        <div class="matters-error">
          <h3>Content Not Found</h3>
          <p>No content available for "${id}"</p>
        </div>
      `;
      
    } catch (error) {
      console.error('❌ Error loading content:', error);
      container.innerHTML = `
        <div class="matters-error">
          <h3>Error Loading Content</h3>
          <p>Unable to load the content. Please try again.</p>
          <p class="matters-error-details">${error.message}</p>
        </div>
      `;
    }
  }
  
  function renderMattersContent(container, content) {
    const {
      subhead,
      intro,
      bullets,
      violations,
      harmIndex,
      connectedEvidence
    } = content;

    container.innerHTML = `
      <div class="matters-heading">Why This Matters</div>
      
      <div class="matters-subhead">${subhead || ''}</div>
      
      <div class="matters-lead">${intro || ''}</div>
      
      <div class="matters-bullets">
        ${(bullets || []).map(bullet => `
          <div class="matters-bullet">
            ${bullet}
            <div class="matters-divider"></div>
          </div>
        `).join('')}
      </div>
      
      ${violations ? `
        <div class="matters-violations">
          <div class="matters-violations-heading">FCRA Violations Supported:</div>
          <div class="matters-violations-codes">${violations.join(', ')}</div>
        </div>
        
        <div class="matters-divider"></div>
      ` : ''}
      
      ${harmIndex ? `
        <div class="matters-harm-index">
          Harm Index: <span class="matters-harm-dot">●</span> ${harmIndex}
        </div>
      ` : ''}
      
      ${connectedEvidence ? `
        <div class="matters-connected">
          <ul class="matters-connected-list">
            ${connectedEvidence.map(evidence => `
              <li class="matters-connected-item">${evidence}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  }
  
  function renderEvidenceContent(container, content) {
    // Extract relevant information from evidence document
    const title = content.title || '';
    const type = content.type || '';
    const body = content.content?.body || [];
    
    // Create a summary from the body content
    const summary = body
      .filter(item => item.type === 'paragraph' && !item.text.startsWith('<strong>'))
      .slice(0, 3)
      .map(item => item.text.replace(/<[^>]+>/g, ''))
      .join(' ');
    
    container.innerHTML = `
      <div class="matters-heading">Why This Matters</div>
      
      <div class="matters-subhead">${title}</div>
      
      <div class="matters-lead">${summary}</div>
      
      <div class="matters-divider"></div>
      
      <div class="matters-type">
        Document Type: ${type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
    `;
  }

  return {
    render
  };
})();

// Make renderer globally available
window.MattersRenderer = MattersRenderer;

// Usage:
// MattersRenderer.render("rocket-referral");