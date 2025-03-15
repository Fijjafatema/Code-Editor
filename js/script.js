document.addEventListener('DOMContentLoaded', () => {
    // Menu item click handling
    const menuItems = document.querySelectorAll('.menu-item');
    const menuOptions = document.querySelectorAll('.menu-option');

    // Extension data - mock extensions marketplace
    const extensions = [
        {
            name: "Python",
            publisher: "Microsoft",
            description: "IntelliSense, linting, debugging, code formatting, and more for Python",
            downloads: "88.5M",
            rating: 4.5,
            icon: "fab fa-python"
        },
        {
            name: "JavaScript (ES6) code snippets",
            publisher: "charalampos karypidis",
            description: "Code snippets for JavaScript in ES6 syntax",
            downloads: "12.4M",
            rating: 4.8,
            icon: "fab fa-js"
        },
        {
            name: "Live Server",
            publisher: "Ritwick Dey",
            description: "Launch a development local Server with live reload feature",
            downloads: "34.2M",
            rating: 4.9,
            icon: "fas fa-server"
        },
        {
            name: "GitLens",
            publisher: "GitKraken",
            description: "Supercharge Git within VS Code",
            downloads: "28.7M",
            rating: 4.7,
            icon: "fab fa-git-alt"
        },
        {
            name: "Material Icon Theme",
            publisher: "Philipp Kief",
            description: "Material Design Icons for Visual Studio Code",
            downloads: "19.3M",
            rating: 4.9,
            icon: "fas fa-palette"
        }
    ];

    // Function to render extensions
    function renderExtensions(searchQuery = '') {
        const extensionsContainer = document.getElementById('extensions');
        const extensionsList = extensionsContainer.querySelector('.extensions-list') || document.createElement('div');
        extensionsList.className = 'extensions-list';
        extensionsList.innerHTML = '';

        const filteredExtensions = extensions.filter(ext => 
            ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ext.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ext.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filteredExtensions.forEach(ext => {
            const extElement = document.createElement('div');
            extElement.className = 'extension-item';
            extElement.innerHTML = `
                <div class="extension-icon">
                    <i class="${ext.icon}"></i>
                </div>
                <div class="extension-info">
                    <div class="extension-header">
                        <span class="extension-name">${ext.name}</span>
                        <span class="extension-publisher">${ext.publisher}</span>
                    </div>
                    <div class="extension-description">${ext.description}</div>
                    <div class="extension-meta">
                        <span class="extension-downloads"><i class="fas fa-download"></i> ${ext.downloads}</span>
                        <span class="extension-rating"><i class="fas fa-star"></i> ${ext.rating}</span>
                    </div>
                </div>
                <button class="install-button">Install</button>
            `;

            // Add install button click handler
            const installButton = extElement.querySelector('.install-button');
            installButton.addEventListener('click', () => {
                if (installButton.textContent === 'Install') {
                    installButton.textContent = 'Installing...';
                    setTimeout(() => {
                        installButton.textContent = 'Uninstall';
                        installButton.classList.add('installed');
                    }, 1500);
                } else {
                    installButton.textContent = 'Install';
                    installButton.classList.remove('installed');
                }
            });

            extensionsList.appendChild(extElement);
        });

        if (!extensionsContainer.querySelector('.extensions-list')) {
            extensionsContainer.appendChild(extensionsList);
        }
    }

    // Handle extension search
    const extensionSearch = document.querySelector('#extensions .search-container input');
    if (extensionSearch) {
        extensionSearch.addEventListener('input', (e) => {
            renderExtensions(e.target.value);
        });
    }

    // Initial render of extensions
    renderExtensions();

    // File handling functions
    const fileHandler = {
        // Create a new file
        newFile: () => {
            const fileName = prompt('Enter file name:', 'untitled.txt');
            if (fileName) {
                // Create new file element
                const fileElement = document.createElement('div');
                fileElement.className = 'file';
                fileElement.innerHTML = `<i class="fas fa-file-code"></i> ${fileName}`;
                
                // Add to files container
                const filesContainer = document.querySelector('.files');
                filesContainer.appendChild(fileElement);
            }
        },

        // Open file dialog
        openFile: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        // Create new file element
                        const fileElement = document.createElement('div');
                        fileElement.className = 'file';
                        fileElement.innerHTML = `<i class="fas fa-file-code"></i> ${file.name}`;
                        
                        // Add to files container
                        const filesContainer = document.querySelector('.files');
                        filesContainer.appendChild(fileElement);

                        // Display content in main area
                        const mainContent = document.querySelector('.main-content');
                        mainContent.innerHTML = `
                            <h2>${file.name}</h2>
                            <pre>${event.target.result}</pre>
                        `;
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        },

        // Open folder dialog
        openFolder: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.webkitdirectory = true;
            input.directory = true;
            input.multiple = true;
            
            input.onchange = (e) => {
                const files = Array.from(e.target.files);
                const filesContainer = document.querySelector('.files');
                filesContainer.innerHTML = ''; // Clear existing files

                // Sort files by directory structure
                const fileTree = {};
                files.forEach(file => {
                    const path = file.webkitRelativePath.split('/');
                    let current = fileTree;
                    path.forEach((part, index) => {
                        if (index === path.length - 1) {
                            current[part] = file;
                        } else {
                            current[part] = current[part] || {};
                            current = current[part];
                        }
                    });
                });

                // Update folder name
                const folderSpan = document.querySelector('.folder span');
                folderSpan.innerHTML = `<i class="fas fa-chevron-down"></i> ${files[0].webkitRelativePath.split('/')[0]}`;

                // Render file tree
                const renderFiles = (tree, container) => {
                    Object.entries(tree).forEach(([name, value]) => {
                        if (value instanceof File) {
                            const fileElement = document.createElement('div');
                            fileElement.className = 'file';
                            fileElement.innerHTML = `<i class="fas fa-file-code"></i> ${name}`;
                            fileElement.addEventListener('click', () => {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const mainContent = document.querySelector('.main-content');
                                    mainContent.innerHTML = `
                                        <h2>${name}</h2>
                                        <pre>${event.target.result}</pre>
                                    `;
                                };
                                reader.readAsText(value);
                            });
                            container.appendChild(fileElement);
                        } else {
                            const folderElement = document.createElement('div');
                            folderElement.className = 'folder';
                            folderElement.innerHTML = `
                                <span><i class="fas fa-chevron-right"></i> ${name}</span>
                                <div class="files" style="display: none;"></div>
                            `;
                            container.appendChild(folderElement);
                            renderFiles(value, folderElement.querySelector('.files'));
                        }
                    });
                };

                renderFiles(fileTree, filesContainer);
                
                // Reattach folder toggle listeners
                attachFolderListeners();
            };
            input.click();
        },

        // Save current file
        saveFile: () => {
            const mainContent = document.querySelector('.main-content pre');
            if (mainContent) {
                const blob = new Blob([mainContent.textContent], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'file.txt';
                a.click();
                window.URL.revokeObjectURL(url);
            }
        }
    };

    // Map menu actions to functions
    const menuActions = {
        'New File': fileHandler.newFile,
        'Open File...': fileHandler.openFile,
        'Open Folder...': fileHandler.openFolder,
        'Save': fileHandler.saveFile,
        'Save As...': fileHandler.saveFile
    };

    // Add click events for menu options
    menuOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = option.querySelector('span').textContent;
            console.log(`Menu action clicked: ${action}`);
            
            // Execute the corresponding action if it exists
            if (menuActions[action]) {
                menuActions[action]();
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-item')) {
            menuItems.forEach(item => {
                const dropdown = item.querySelector('.dropdown-menu');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            });
        }
    });

    // Function to attach folder toggle listeners
    function attachFolderListeners() {
        const folders = document.querySelectorAll('.folder span');
        folders.forEach(folder => {
            folder.addEventListener('click', () => {
                const files = folder.nextElementSibling;
                const icon = folder.querySelector('i');
                
                if (files.style.display === 'none' || !files.style.display) {
                    files.style.display = 'block';
                    icon.classList.remove('fa-chevron-right');
                    icon.classList.add('fa-chevron-down');
                } else {
                    files.style.display = 'none';
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-right');
                }
            });
        });
    }

    // Initial folder listeners
    attachFolderListeners();

    // Sidebar functionality
    const icons = document.querySelectorAll('.icon');
    const contents = document.querySelectorAll('.sidebar-content');

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            icons.forEach(i => i.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            icon.classList.add('active');
            const tabName = icon.getAttribute('data-tab');
            document.getElementById(tabName).classList.add('active');
        });
    });
});
