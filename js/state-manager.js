// state-manager.js
// Handles UI for saving and loading violation states

// Load Adobe Fonts (Typekit)
(function() {
  const link = document.createElement('link');
  link.href = 'https://use.typekit.net/qes3lop.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
})();

const StateManager = (function() {
  'use strict';

  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;
  let dragTarget = null;
  let currentFile = null;
  let autoSaveIndicator = null;
  let autoSaveTimeout = null;
  let activeEllipsisMenu = null;

  function createStateManagerUI() {
    createToggleButton();
    createManagerWindow();
    createAutoSaveIndicator();
    
    // Close ellipsis menu when clicking outside
    document.addEventListener('click', (e) => {
      if (activeEllipsisMenu && !e.target.closest('.ellipsis-menu') && !e.target.closest('.ellipsis-button')) {
        activeEllipsisMenu.remove();
        activeEllipsisMenu = null;
      }
    });
  }

  function createAutoSaveIndicator() {
    autoSaveIndicator = document.createElement('div');
    autoSaveIndicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 4px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 12px;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 9999;
    `;
    document.body.appendChild(autoSaveIndicator);
  }

  function showAutoSaveStatus(message) {
    if (!autoSaveIndicator) return;
    
    autoSaveIndicator.textContent = message;
    autoSaveIndicator.style.opacity = '1';
    
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    autoSaveTimeout = setTimeout(() => {
      autoSaveIndicator.style.opacity = '0';
    }, 2000);
  }

  function createToggleButton() {
    // Create container for both icon and label
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      top: 36px;
      left: 1900px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 999;
    `;

    // Add to viosessions container
    const vioContainer = document.getElementById('viosessions-container');
    if (vioContainer) {
      vioContainer.appendChild(container);
    } else {
      document.body.appendChild(container);
    }

    // Create icon button
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'state-manager-toggle';
    toggleBtn.style.cssText = `
      width: 49px;
      height: 49px;
      border: 4px solid #000000;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      transition: transform 0.2s ease;
    `;

    // Create SVG save icon
    const saveIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    saveIcon.setAttribute("viewBox", "0 0 24 24");
    saveIcon.setAttribute("width", "28");
    saveIcon.setAttribute("height", "28");
    saveIcon.style.cssText = `
      fill: none;
      stroke: #000000;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    `;

    // Create the save icon paths
    const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    iconPath.setAttribute("d", "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8");

    // Create label
    const label = document.createElement('div');
    label.style.cssText = `
      margin-top: 11px;
      width: 80px;
      height: 34px;
      text-align: center;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 500;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 17px;
    `;
    label.innerHTML = 'VIO<br>SESSIONS';

    // Add hover effect
    toggleBtn.onmouseover = () => {
      toggleBtn.style.transform = 'scale(1.1)';
    };
    toggleBtn.onmouseout = () => {
      toggleBtn.style.transform = 'scale(1)';
    };

    toggleBtn.onclick = toggleManagerWindow;

    // Assemble the components
    saveIcon.appendChild(iconPath);
    toggleBtn.appendChild(saveIcon);
    container.appendChild(toggleBtn);
    container.appendChild(label);
  }

  function createManagerWindow() {
    // Create container
    const container = document.createElement('div');
    container.id = 'state-manager';
    container.style.cssText = `
      position: fixed;
      top: 22px;
      left: 1170px;
      width: 300px;
      background: white;
      border: 16px solid #253541;
      border-radius: 24px;
      box-shadow: 0 6px 25px rgba(0,0,0,0.25);
      z-index: 1000;
      font-family: 'bernino-sans-compressed', sans-serif;
      display: none;
      transform: translate(0, 0);
      flex-direction: column;
      max-height: 80vh;
      overflow: hidden;
    `;

    // Add header container
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 15px 10px;
      background: transparent;
      color: #253541;
      display: flex;
      flex-direction: column;
      user-select: none;
      border-bottom: 1px solid #eee;
    `;

    // Add plus button and title row
    const titleRow = document.createElement('div');
    titleRow.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    `;

    // Add plus button
    const plusBtn = document.createElement('button');
    plusBtn.innerHTML = '+';
    plusBtn.style.cssText = `
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    `;
    plusBtn.onmouseover = () => {
      plusBtn.style.transform = 'scale(1.1)';
      plusBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    };
    plusBtn.onmouseout = () => {
      plusBtn.style.transform = 'scale(1)';
      plusBtn.style.boxShadow = 'none';
    };
    plusBtn.onclick = createNewFile;

    // Add title
    const title = document.createElement('div');
    title.style.cssText = `
      font-family: "Bernino Sans Compressed Extrabold", sans-serif;
      font-size: 28px;
      color: rgba(0, 0, 0, 0.9);
    `;
    title.textContent = 'VioSessions';

    // Add subtitle
    const subtitle = document.createElement('div');
    subtitle.style.cssText = `
      font-size: 12px;
      color: #666;
      margin-left: 36px;
    `;
    subtitle.textContent = 'Your saved sessions and tagged reports';

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: rgba(0, 0, 0, 0.9);
      font-size: 24px;
      cursor: pointer;
      padding: 0 5px;
      position: absolute;
      top: 15px;
      right: 15px;
    `;
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      toggleManagerWindow(false);
    };

    // Add content container
    const content = document.createElement('div');
    content.style.cssText = `
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px;
    `;

    // Add saved states list
    const savedStatesList = document.createElement('div');
    savedStatesList.id = 'saved-states-list';
    savedStatesList.style.cssText = `
      overflow-y: auto;
      overflow-x: hidden;
    `;

    // Assemble the components
    titleRow.appendChild(plusBtn);
    titleRow.appendChild(title);
    header.appendChild(titleRow);
    header.appendChild(subtitle);
    content.appendChild(savedStatesList);
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(closeBtn);
    document.body.appendChild(container);

    // Add drag functionality
    header.addEventListener('mousedown', dragStart, false);
    document.addEventListener('mousemove', drag, false);
    document.addEventListener('mouseup', dragEnd, false);

    updateSavedStatesList();
  }

  function createEllipsisMenu(name, x, y) {
    // Remove any existing menu
    if (activeEllipsisMenu) {
      activeEllipsisMenu.remove();
      activeEllipsisMenu = null;
    }

    const menu = document.createElement('div');
    menu.className = 'ellipsis-menu';
    menu.style.cssText = `
      position: fixed;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 4px 0;
      z-index: 1001;
      min-width: 160px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13px;
    `;

    // Position the menu
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const createMenuItem = (text, onClick) => {
      const item = document.createElement('div');
      item.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        transition: background-color 0.2s;
      `;
      item.textContent = text;
      item.onmouseover = () => {
        item.style.backgroundColor = '#f8f9fa';
      };
      item.onmouseout = () => {
        item.style.backgroundColor = 'transparent';
      };
      item.onclick = onClick;
      return item;
    };

    // Add menu items
    menu.appendChild(createMenuItem('Rename', () => {
      const newName = prompt('Enter new name:', name);
      if (newName && newName !== name) {
        renameFile(name, newName);
      }
    }));

    menu.appendChild(createMenuItem('Make a Copy', () => {
      const copyName = `${name}_copy`;
      duplicateFile(name, copyName);
    }));

    menu.appendChild(createMenuItem('Delete', () => {
      if (confirm(`Delete "${name}"?`)) {
        deleteFile(name);
      }
    }));

    menu.appendChild(createMenuItem('Export JSON', () => {
      exportFileAsJson(name);
    }));

    document.body.appendChild(menu);
    activeEllipsisMenu = menu;

    // Adjust position if menu would go off screen
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
      menu.style.left = `${x - menuRect.width}px`;
    }
    if (menuRect.bottom > window.innerHeight) {
      menu.style.top = `${y - menuRect.height}px`;
    }
  }

  function renameFile(oldName, newName) {
    const savedStates = JSON.parse(localStorage.getItem(SAVED_STATES_KEY) || '{}');
    if (savedStates[oldName]) {
      savedStates[newName] = savedStates[oldName];
      delete savedStates[oldName];
      localStorage.setItem(SAVED_STATES_KEY, JSON.stringify(savedStates));
      
      if (currentFile === oldName) {
        currentFile = newName;
      }
      
      updateSavedStatesList();
      showAutoSaveStatus(`✏️ Renamed to "${newName}"`);
    }
  }

  function duplicateFile(name, copyName) {
    const savedStates = JSON.parse(localStorage.getItem(SAVED_STATES_KEY) || '{}');
    if (savedStates[name]) {
      savedStates[copyName] = {
        ...savedStates[name],
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(SAVED_STATES_KEY, JSON.stringify(savedStates));
      updateSavedStatesList();
      showAutoSaveStatus(`📋 Created copy "${copyName}"`);
    }
  }

  function deleteFile(name) {
    if (CanvasView.deleteState(name)) {
      if (currentFile === name) {
        currentFile = null;
      }
      updateSavedStatesList();
      showAutoSaveStatus(`🗑️ Deleted "${name}"`);
    }
  }

  function exportFileAsJson(name) {
    const savedStates = JSON.parse(localStorage.getItem(SAVED_STATES_KEY) || '{}');
    if (savedStates[name]) {
      const dataStr = JSON.stringify(savedStates[name], null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showAutoSaveStatus(`📥 Exported "${name}.json"`);
    }
  }

  function createNewFile() {
    const name = prompt('Enter a name for your new session:');
    if (!name) return;

    if (CanvasView.saveState(name)) {
      currentFile = name;
      updateSavedStatesList();
      showAutoSaveStatus(`💾 Created "${name}"`);
      toggleManagerWindow(false);
    } else {
      alert('Failed to create file.');
    }
  }

  function autoSave() {
    if (!currentFile) return;
    
    if (CanvasView.saveState(currentFile)) {
      showAutoSaveStatus(`💾 All changes saved to "${currentFile}"`);
    }
  }

  function dragStart(e) {
    if (!e.target.closest('#state-manager')) return;
    
    const container = document.getElementById('state-manager');
    if (!container) return;

    dragTarget = container;
    isDragging = true;

    // Get current transform values
    const transform = window.getComputedStyle(container).transform;
    const matrix = new DOMMatrix(transform);
    xOffset = matrix.m41;
    yOffset = matrix.m42;

    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    e.preventDefault();
  }

  function drag(e) {
    if (!isDragging || !dragTarget) return;

    e.preventDefault();

    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    xOffset = currentX;
    yOffset = currentY;

    dragTarget.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }

  function dragEnd(e) {
    if (!isDragging) return;

    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    dragTarget = null;
  }

  function toggleManagerWindow(show = null) {
    const manager = document.getElementById('state-manager');
    if (!manager) return;

    if (show === null) {
      manager.style.display = manager.style.display === 'none' ? 'block' : 'none';
    } else {
      manager.style.display = show ? 'block' : 'none';
    }

    if (manager.style.display === 'block') {
      updateSavedStatesList();
    }
  }

  function updateSavedStatesList() {
    const container = document.getElementById('saved-states-list');
    if (!container) return;

    const savedStates = CanvasView.getSavedStates();
    container.innerHTML = '';

    if (savedStates.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No files yet</p>';
      return;
    }

    savedStates
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach(({name, timestamp}) => {
        const stateEl = document.createElement('div');
        stateEl.style.cssText = `
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 4px;
          background: ${currentFile === name ? '#f0f7ff' : 'transparent'};
        `;

        // Create link container
        const linkContainer = document.createElement('div');
        linkContainer.style.cssText = `
          flex: 1;
          min-width: 0;
          padding-right: 10px;
        `;

        // Create clickable link
        const link = document.createElement('a');
        link.textContent = name;
        link.title = name; // Full name in tooltip
        link.style.cssText = `
          font-size: 9pt;
          color: ${currentFile === name ? '#0066cc' : '#333'};
          text-decoration: none;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
          cursor: pointer;
          transition: all 0.2s;
        `;
        link.onmouseover = () => {
          link.style.color = '#0066cc';
          stateEl.style.background = '#f8f9fa';
        };
        link.onmouseout = () => {
          link.style.color = currentFile === name ? '#0066cc' : '#333';
          stateEl.style.background = currentFile === name ? '#f0f7ff' : 'transparent';
        };
        link.onclick = () => {
          if (CanvasView.loadState(name)) {
            currentFile = name;
            showAutoSaveStatus(`💾 Opened "${name}"`);
            updateSavedStatesList();
            toggleManagerWindow(false);
          } else {
            alert('Failed to load file.');
          }
        };

        // Create timestamp
        const timeEl = document.createElement('div');
        timeEl.textContent = new Date(timestamp).toLocaleString();
        timeEl.style.cssText = `
          font-size: 9pt;
          color: #666;
          white-space: nowrap;
          margin-right: 10px;
        `;

        // Create ellipsis button
        const ellipsisBtn = document.createElement('button');
        ellipsisBtn.className = 'ellipsis-button';
        ellipsisBtn.textContent = '⋮';
        ellipsisBtn.style.cssText = `
          background: none;
          border: none;
          font-size: 16px;
          color: #666;
          cursor: pointer;
          padding: 0 5px;
          transition: all 0.2s;
          opacity: 0.6;
        `;
        ellipsisBtn.onmouseover = () => {
          ellipsisBtn.style.opacity = '1';
        };
        ellipsisBtn.onmouseout = () => {
          ellipsisBtn.style.opacity = '0.6';
        };
        ellipsisBtn.onclick = (e) => {
          e.stopPropagation();
          const rect = ellipsisBtn.getBoundingClientRect();
          createEllipsisMenu(name, rect.right, rect.top);
        };

        linkContainer.appendChild(link);
        stateEl.appendChild(linkContainer);
        stateEl.appendChild(timeEl);
        stateEl.appendChild(ellipsisBtn);
        container.appendChild(stateEl);
      });
  }

  // Set up auto-save listener
  document.addEventListener('violationStateChanged', () => {
    if (currentFile) {
      autoSave();
    }
  });

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    createStateManagerUI();
    // Ensure the manager window is hidden initially
    const manager = document.getElementById('state-manager');
    if (manager) {
      manager.style.display = 'none';
    }
  });

  // Public API
  return {
    updateSavedStatesList,
    toggleManagerWindow,
    getCurrentFile: () => currentFile
  };
})();

// Make StateManager globally available
window.StateManager = StateManager; 