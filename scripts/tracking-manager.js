// Enhanced Tracking Manager for Analytics Testing Playground
(function () {
    // Forward declare all internal functions that are used across different functions
    let initTrackingManager;
    let insertTrackingManagerUI;
    let initEventListeners;
    let applyGTMContainer;
    let applyGAMeasurement;
    let applyAdobeLaunch;
    let applyCustomCode;
    let removeTrackingTool;
    let removeScriptById;
    let updateTrackingStatus;
    let saveTrackingConfiguration;
    let removeTrackingConfiguration;
    let loadTrackingConfigurations;
    let findPageSpecificTrackableElements;
    let getCurrentPage;
    let addElementsIfExist;
    let openCustomCodeModal;
    let saveElementCustomCode;
    let removeElementCustomCode;
    let applyElementCustomCode;
    let removeExistingCustomCode;
    let refreshAllTrackingStatuses;
    let initCustomCodeButtons;

    // Initialize tracking manager after DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOM fully loaded, initializing tracking manager');
        initTrackingManager();
        initCustomCodeButtons();
    });

    // Define critical functions first (those used by other functions)

    // Function for updating status displays
    updateTrackingStatus = function (tool, value) {
        console.log(`Updating tracking status for ${tool} to:`, value);

        try {
            const statusElement = document.getElementById(`${tool}-status`);
            if (statusElement) {
                const statusText = statusElement.querySelector('span');
                if (statusText) {
                    if (value) {
                        // Convert long values to "Applied" for display clarity
                        statusText.textContent = typeof value === 'string' && value.length > 20 ?
                            'Applied' : value;
                        statusText.style.color = 'green';
                        console.log(`Status updated for ${tool}`);
                    } else {
                        statusText.textContent = 'Not configured';
                        statusText.style.color = '';
                        console.log(`Status cleared for ${tool}`);
                    }
                } else {
                    console.warn(`Status text element not found for ${tool}`);
                }
            } else {
                console.warn(`Status element #${tool}-status not found`);
            }
        } catch (error) {
            console.error(`Error in updateTrackingStatus for ${tool}:`, error);
        }
    };

    // Function for removing DOM elements by ID
    removeScriptById = function (id) {
        const script = document.getElementById(id);
        if (script && script.parentNode) {
            script.parentNode.removeChild(script);
            return true;
        }
        return false;
    };

    // Function to remove existing custom code
    removeExistingCustomCode = function () {
        console.log('Removing existing custom code');
        try {
            // Remove any existing custom code elements
            removeScriptById('custom-head-code-script');
            removeScriptById('custom-head-code-style');
            removeScriptById('custom-head-code-container');

            // Also remove any custom scripts that were added
            for (let i = 0; i < 10; i++) { // Assume no more than 10 custom scripts
                removeScriptById(`custom-script-${i}`);
            }

            // Remove comment markers and nodes between them
            let foundBegin = false;
            let nodesToRemove = [];
            let beginNode = null;
            let endNode = null;

            // Find our marker comments and all nodes in between
            for (let i = 0; i < document.head.childNodes.length; i++) {
                const node = document.head.childNodes[i];

                if (node.nodeType === 8) { // Comment node
                    if (node.nodeValue && node.nodeValue.trim() === 'BEGIN CUSTOM CODE') {
                        foundBegin = true;
                        beginNode = node;
                        continue;
                    }
                    else if (node.nodeValue && node.nodeValue.trim() === 'END CUSTOM CODE') {
                        endNode = node;
                        break;
                    }
                }

                if (foundBegin) {
                    nodesToRemove.push(node);
                }
            }

            // Remove the nodes between our markers
            for (let i = 0; i < nodesToRemove.length; i++) {
                const node = nodesToRemove[i];
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }

            // Remove the marker comments
            if (beginNode && beginNode.parentNode) {
                beginNode.parentNode.removeChild(beginNode);
            }
            if (endNode && endNode.parentNode) {
                endNode.parentNode.removeChild(endNode);
            }

            console.log('Existing custom code removed');
        } catch (error) {
            console.error('Error removing existing custom code:', error);
        }
    };

    // Function to refresh all tracking statuses
    // Replace the refreshAllTrackingStatuses function with this enhanced version
    refreshAllTrackingStatuses = function () {
        console.log('Refreshing all tracking statuses');
        try {
            const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
            console.log('Found configurations for status refresh:', Object.keys(configurations));

            // Force status element check and update
            const customCodeStatus = document.getElementById('custom-code-status');
            const customCodeStatusText = customCodeStatus?.querySelector('span');

            if (customCodeStatusText) {
                console.log('Custom code status element found');
                if (configurations.customCode) {
                    console.log('Custom code configuration found, updating status');
                    customCodeStatusText.textContent = 'Applied';
                    customCodeStatusText.style.color = 'green';
                } else {
                    console.log('No custom code configuration found');
                    customCodeStatusText.textContent = 'Not configured';
                    customCodeStatusText.style.color = '';
                }
            } else {
                console.warn('Custom code status element not found!');
            }

            // Update other statuses
            if (configurations.gtm) updateTrackingStatus('gtm', configurations.gtm);
            if (configurations.ga) updateTrackingStatus('ga', configurations.ga);
            if (configurations.adobe) updateTrackingStatus('adobe', configurations.adobe);

            console.log('All tracking statuses refreshed');
        } catch (error) {
            console.error('Error refreshing tracking statuses:', error);
        }
    };

    // Also modify the loadTrackingConfigurations function to call status refresh after a greater delay
    loadTrackingConfigurations = function () {
        // [keep existing code]

        // At the end of the function, add this:

        // Refresh all statuses after a longer delay to ensure everything is loaded
        setTimeout(function () {
            console.log('Delayed status refresh starting');
            refreshAllTrackingStatuses();

            // Double-check custom code status specifically
            setTimeout(function () {
                const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
                if (configurations.customCode) {
                    console.log('Final check for custom code status');
                    updateTrackingStatus('customCode', 'Applied');
                }
            }, 200);
        }, 1000);
    };

    // Also add a direct custom code status check after applying custom code
    applyCustomCode = function (customCode) {
        // [keep existing implementation]

        // At the end of the function, after updating the status, add:
        setTimeout(function () {
            console.log('Delayed status update after applying custom code');
            updateTrackingStatus('customCode', 'Applied');
        }, 100);

        return true;
    };

    // Add one more function to ensure statuses are updated when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        // Wait for everything to be fully initialized
        setTimeout(function () {
            console.log('Final DOM loaded status check');
            const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
            if (configurations.customCode) {
                updateTrackingStatus('customCode', 'Applied');
            }
        }, 1500);
    });

    // Main initialization function
    initTrackingManager = function () {
        console.log('Initializing tracking manager');
        try {
            // Insert tracking management UI after header
            insertTrackingManagerUI();

            // Load previously saved tracking configurations
            loadTrackingConfigurations();

            // Initialize event listeners
            initEventListeners();

            // Initialize Adobe Client Data Layer if it doesn't exist
            if (typeof adobeDataLayer === 'undefined') {
                window.adobeDataLayer = window.adobeDataLayer || [];
            }

            // Initialize dataLayer if it doesn't exist
            if (typeof dataLayer === 'undefined') {
                window.dataLayer = window.dataLayer || [];
            }

            console.log('Tracking manager initialized');
        } catch (error) {
            console.error('Error initializing tracking manager:', error);
        }
    };

    // Function to insert tracking manager UI
    insertTrackingManagerUI = function () {
        console.log('Inserting tracking manager UI');
        try {
            const header = document.querySelector('header');
            if (!header) {
                console.warn('Header element not found, cannot insert tracking manager UI');
                return;
            }

            const trackingManagerHTML = `
                <div id="tracking-manager" class="tracking-manager">
                    <div class="tracking-manager-header">
                        <h2>Tracking Manager</h2>
                        <button id="toggle-tracking-manager" class="btn tertiary">Toggle</button>
                    </div>
                    <div class="tracking-manager-content">
                        <div class="tabs">
                            <div class="tab-nav">
                                <button class="tab-button active" data-tab="tab-gtm">Google Tag Manager</button>
                                <button class="tab-button" data-tab="tab-ga">Google Analytics</button>
                                <button class="tab-button" data-tab="tab-adobe">Adobe Launch</button>
                                <button class="tab-button" data-tab="tab-custom-code">Custom Code</button>
                            </div>
                            <div class="tab-content active" id="tab-gtm">
                                <form id="gtm-form">
                                    <div class="form-group">
                                        <label for="gtm-container-id">GTM Container ID:</label>
                                        <input type="text" id="gtm-container-id" name="gtmContainerId" placeholder="GTM-XXXXXXX">
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn primary">Apply GTM Container</button>
                                        <button type="button" id="remove-gtm" class="btn secondary">Remove GTM</button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-content" id="tab-ga">
                                <form id="ga-form">
                                    <div class="form-group">
                                        <label for="ga-measurement-id">GA4 Measurement ID:</label>
                                        <input type="text" id="ga-measurement-id" name="gaMeasurementId" placeholder="G-XXXXXXXXXX">
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn primary">Apply GA4 Measurement</button>
                                        <button type="button" id="remove-ga" class="btn secondary">Remove GA</button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-content" id="tab-adobe">
                                <form id="adobe-form">
                                    <div class="form-group">
                                        <label for="adobe-launch-url">Adobe Launch Script URL:</label>
                                        <input type="text" id="adobe-launch-url" name="adobeLaunchUrl" placeholder="//assets.adobedtm.com/...">
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn primary">Apply Adobe Launch</button>
                                        <button type="button" id="remove-adobe" class="btn secondary">Remove Adobe</button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-content" id="tab-custom-code">
                                <form id="custom-code-form">
                                    <div class="form-group">
                                        <label for="custom-head-code">Custom Code for &lt;head&gt; Section:</label>
                                        <textarea id="custom-head-code" name="customHeadCode" placeholder="// Add your custom JavaScript, CSS, or other code here
// Example:
(function() {
  console.log('Custom head code loaded!');
  // Initialize your tools here
})();"></textarea>
                                        <p class="hint">This code will be added to the &lt;head&gt; section of every page.</p>
                                    </div>
                                    <div class="form-actions">
                                        <button type="submit" class="btn primary">Apply Custom Code</button>
                                        <button type="button" id="remove-custom-code" class="btn secondary">Remove Custom Code</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="tracking-manager-status">
                            <h3>Active Tracking Solutions:</h3>
                            <ul id="active-tracking">
                                <li id="gtm-status">Google Tag Manager: <span>Not configured</span></li>
                                <li id="ga-status">Google Analytics: <span>Not configured</span></li>
                                <li id="adobe-status">Adobe Launch: <span>Not configured</span></li>
                                <li id="custom-code-status">Custom Code: <span>Not configured</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            // Create the tracking manager element
            const trackingManager = document.createElement('div');
            trackingManager.innerHTML = trackingManagerHTML;

            // Insert after header
            header.parentNode.insertBefore(trackingManager, header.nextSibling);

            // Add the custom code modal to the body
            const customCodeModalHTML = `
                <div id="custom-code-modal" class="custom-code-modal">
                    <div class="custom-code-modal-content">
                        <div class="custom-code-modal-header">
                            <h3>Custom Code for <span id="element-id">Element</span></h3>
                            <button class="custom-code-modal-close">&times;</button>
                        </div>
                        <textarea id="element-custom-code" placeholder="// Add your custom JavaScript code here. It will execute when this element is interacted with.
// Example:
console.log('Element clicked:', element);
// You can access the event object and the element
alert('Custom code executed for ' + element.id);"></textarea>
                        <div class="form-actions">
                            <button id="save-element-code" class="btn primary">Save Custom Code</button>
                            <button id="remove-element-code" class="btn secondary">Remove Custom Code</button>
                        </div>
                    </div>
                </div>
            `;

            const customCodeModal = document.createElement('div');
            customCodeModal.innerHTML = customCodeModalHTML;
            document.body.appendChild(customCodeModal);

            console.log('Tracking manager UI inserted');
        } catch (error) {
            console.error('Error inserting tracking manager UI:', error);
        }
    };

    // Function to initialize event listeners
    initEventListeners = function () {
        console.log('Initializing event listeners');
        try {
            // Toggle tracking manager visibility
            const toggleButton = document.getElementById('toggle-tracking-manager');
            if (toggleButton) {
                toggleButton.addEventListener('click', function () {
                    const content = document.querySelector('.tracking-manager-content');
                    if (content) {
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    }
                });
            }

            // Tab functionality
            const tabButtons = document.querySelectorAll('.tracking-manager .tab-button');
            const tabContents = document.querySelectorAll('.tracking-manager .tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const tabId = this.getAttribute('data-tab');

                    // Deactivate all tabs
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));

                    // Activate clicked tab
                    this.classList.add('active');
                    document.getElementById(tabId).classList.add('active');
                });
            });

            // GTM form submission
            const gtmForm = document.getElementById('gtm-form');
            if (gtmForm) {
                gtmForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const containerId = document.getElementById('gtm-container-id').value.trim();
                    if (containerId) {
                        applyGTMContainer(containerId);
                        saveTrackingConfiguration('gtm', containerId);
                    }
                });
            }

            // GA form submission
            const gaForm = document.getElementById('ga-form');
            if (gaForm) {
                gaForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const measurementId = document.getElementById('ga-measurement-id').value.trim();
                    if (measurementId) {
                        applyGAMeasurement(measurementId);
                        saveTrackingConfiguration('ga', measurementId);
                    }
                });
            }

            // Adobe form submission
            const adobeForm = document.getElementById('adobe-form');
            if (adobeForm) {
                adobeForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const launchUrl = document.getElementById('adobe-launch-url').value.trim();
                    if (launchUrl) {
                        applyAdobeLaunch(launchUrl);
                        saveTrackingConfiguration('adobe', launchUrl);
                    }
                });
            }

            // Custom code form submission
            const customCodeForm = document.getElementById('custom-code-form');
            if (customCodeForm) {
                customCodeForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    console.log('Custom code form submitted');
                    const customCode = document.getElementById('custom-head-code').value.trim();
                    if (customCode) {
                        console.log('Applying custom code from form submission');
                        applyCustomCode(customCode);
                        saveTrackingConfiguration('customCode', customCode);
                    }
                });
            }

            // Remove buttons
            const removeGTM = document.getElementById('remove-gtm');
            if (removeGTM) {
                removeGTM.addEventListener('click', function () {
                    removeTrackingTool('gtm');
                });
            }

            const removeGA = document.getElementById('remove-ga');
            if (removeGA) {
                removeGA.addEventListener('click', function () {
                    removeTrackingTool('ga');
                });
            }

            const removeAdobe = document.getElementById('remove-adobe');
            if (removeAdobe) {
                removeAdobe.addEventListener('click', function () {
                    removeTrackingTool('adobe');
                });
            }

            const removeCustomCode = document.getElementById('remove-custom-code');
            if (removeCustomCode) {
                removeCustomCode.addEventListener('click', function () {
                    removeTrackingTool('customCode');
                });
            }

            // Custom code modal close button
            const closeModalButton = document.querySelector('.custom-code-modal-close');
            if (closeModalButton) {
                closeModalButton.addEventListener('click', function () {
                    document.getElementById('custom-code-modal').classList.remove('active');
                });
            }

            // Save element custom code button
            const saveElementCodeButton = document.getElementById('save-element-code');
            if (saveElementCodeButton) {
                saveElementCodeButton.addEventListener('click', function () {
                    const elementId = document.getElementById('element-id').textContent;
                    const customCode = document.getElementById('element-custom-code').value.trim();
                    saveElementCustomCode(elementId, customCode);
                    document.getElementById('custom-code-modal').classList.remove('active');
                });
            }

            // Remove element custom code button
            const removeElementCodeButton = document.getElementById('remove-element-code');
            if (removeElementCodeButton) {
                removeElementCodeButton.addEventListener('click', function () {
                    const elementId = document.getElementById('element-id').textContent;
                    removeElementCustomCode(elementId);
                    document.getElementById('custom-code-modal').classList.remove('active');
                });
            }

            console.log('Event listeners initialized');
        } catch (error) {
            console.error('Error initializing event listeners:', error);
        }
    };

    // Function to apply GTM container
    applyGTMContainer = function (containerId) {
        console.log('Applying GTM container:', containerId);
        try {
            // Remove existing GTM if any
            removeScriptById('gtm-script');
            removeScriptById('gtm-noscript');

            // Add GTM script to head
            const gtmScript = document.createElement('script');
            gtmScript.id = 'gtm-script';
            gtmScript.innerHTML = `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${containerId}');
            `;
            document.head.appendChild(gtmScript);

            // Add GTM noscript to body
            const gtmNoscript = document.createElement('noscript');
            gtmNoscript.id = 'gtm-noscript';
            gtmNoscript.innerHTML = `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `;
            document.body.insertBefore(gtmNoscript, document.body.firstChild);

            // Update status
            updateTrackingStatus('gtm', containerId);
            console.log('GTM container applied successfully');
        } catch (error) {
            console.error('Error applying GTM container:', error);
        }
    };

    // Function to apply GA measurement
    applyGAMeasurement = function (measurementId) {
        console.log('Applying GA measurement ID:', measurementId);
        try {
            // Remove existing GA if any
            removeScriptById('ga-script');
            removeScriptById('ga-config-script');

            // Add GA script to head
            const gaScript = document.createElement('script');
            gaScript.id = 'ga-script';
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
            document.head.appendChild(gaScript);

            // Add GA configuration script
            const gaConfigScript = document.createElement('script');
            gaConfigScript.id = 'ga-config-script';
            gaConfigScript.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${measurementId}');
            `;
            document.head.appendChild(gaConfigScript);

            // Update status
            updateTrackingStatus('ga', measurementId);
            console.log('GA measurement ID applied successfully');
        } catch (error) {
            console.error('Error applying GA measurement ID:', error);
        }
    };

    // Function to apply Adobe Launch
    applyAdobeLaunch = function (launchUrl) {
        console.log('Applying Adobe Launch URL:', launchUrl);
        try {
            // Remove existing Adobe if any
            removeScriptById('adobe-script');

            // Add Adobe Launch script to head
            const adobeScript = document.createElement('script');
            adobeScript.id = 'adobe-script';
            adobeScript.src = launchUrl;
            adobeScript.async = true;
            document.head.appendChild(adobeScript);

            // Initialize Adobe Client Data Layer if it doesn't exist
            if (typeof adobeDataLayer === 'undefined') {
                const adobeDataLayerScript = document.createElement('script');
                adobeDataLayerScript.id = 'adobe-datalayer-script';
                adobeDataLayerScript.innerHTML = `
                    window.adobeDataLayer = window.adobeDataLayer || [];
                `;
                document.head.insertBefore(adobeDataLayerScript, adobeScript);
            }

            // Update status
            updateTrackingStatus('adobe', launchUrl);
            console.log('Adobe Launch URL applied successfully');
        } catch (error) {
            console.error('Error applying Adobe Launch URL:', error);
        }
    };

    // Function to apply custom code
    // Replace the HTML content handling in the applyCustomCode function
    applyCustomCode = function (customCode) {
        console.log('applyCustomCode function called with code length:', customCode.length);

        try {
            // Remove existing custom code if any
            removeExistingCustomCode();

            // Detect if the input is HTML (starts with '<')
            const isHtml = customCode.trim().startsWith('<');
            console.log('Is HTML content:', isHtml);

            // Create marker comments
            const beginComment = document.createComment(' BEGIN CUSTOM CODE ');
            const endComment = document.createComment(' END CUSTOM CODE ');
            document.head.appendChild(beginComment);

            if (isHtml) {
                console.log('Processing HTML content');

                // Special handling for content with script tags
                if (customCode.includes('<script') || customCode.includes('</script>')) {
                    console.log('Detected script tags in HTML');

                    try {
                        // Create a temporary div to parse the HTML into actual DOM elements
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = customCode;

                        // Process each script element
                        const scripts = tempDiv.querySelectorAll('script');
                        console.log(`Found ${scripts.length} script elements`);

                        scripts.forEach((script, index) => {
                            try {
                                // Create a new script element
                                const newScript = document.createElement('script');
                                newScript.id = `custom-script-${index}`;

                                // Copy attributes
                                for (let i = 0; i < script.attributes.length; i++) {
                                    const attr = script.attributes[i];
                                    newScript.setAttribute(attr.name, attr.value);
                                }

                                // Copy content if any
                                if (script.innerHTML) {
                                    newScript.innerHTML = script.innerHTML;
                                }

                                // Add to head
                                document.head.appendChild(newScript);
                                console.log(`Added script ${index} to head`);
                            } catch (scriptError) {
                                console.error(`Error processing script ${index}:`, scriptError);
                            }
                        });

                        // Handle any non-script content
                        // First, clone the temp div and remove scripts
                        const nonScriptDiv = tempDiv.cloneNode(true);
                        const scriptsToRemove = nonScriptDiv.querySelectorAll('script');
                        scriptsToRemove.forEach(s => {
                            if (s.parentNode) {
                                s.parentNode.removeChild(s);
                            }
                        });

                        // Check if there's any remaining content
                        if (nonScriptDiv.innerHTML.trim()) {
                            const containerDiv = document.createElement('div');
                            containerDiv.id = 'custom-head-code-container';
                            containerDiv.style.display = 'none';
                            containerDiv.innerHTML = nonScriptDiv.innerHTML;
                            document.head.appendChild(containerDiv);
                            console.log('Added non-script content to head');
                        }
                    } catch (parseError) {
                        console.error('Error parsing HTML content:', parseError);
                        // Fallback: just add as a hidden div
                        const containerDiv = document.createElement('div');
                        containerDiv.id = 'custom-head-code-container';
                        containerDiv.style.display = 'none';
                        containerDiv.textContent = customCode; // Use textContent to avoid HTML parsing
                        document.head.appendChild(containerDiv);
                    }
                } else if (customCode.includes('<style') || customCode.includes('</style>')) {
                    // Handle style content
                    console.log('Adding as style element');
                    try {
                        const styleEl = document.createElement('style');
                        styleEl.id = 'custom-head-code-style';

                        // Extract CSS from style tags
                        const cssContent = customCode.replace(/<\/?style[^>]*>/g, '');
                        styleEl.textContent = cssContent;
                        document.head.appendChild(styleEl);
                        console.log('Style element added');
                    } catch (styleError) {
                        console.error('Error adding style element:', styleError);
                    }
                } else {
                    // General HTML content
                    console.log('Adding as general HTML container');
                    try {
                        const containerDiv = document.createElement('div');
                        containerDiv.id = 'custom-head-code-container';
                        containerDiv.style.display = 'none';
                        containerDiv.innerHTML = customCode;
                        document.head.appendChild(containerDiv);
                        console.log('HTML container added');
                    } catch (htmlError) {
                        console.error('Error adding HTML container:', htmlError);
                    }
                }
            } else {
                // JavaScript content
                console.log('Adding as JavaScript');
                try {
                    const customCodeScript = document.createElement('script');
                    customCodeScript.id = 'custom-head-code-script';
                    customCodeScript.type = 'text/javascript';

                    // Add try-catch to prevent errors from breaking the page
                    customCodeScript.textContent = `
                    try {
                        ${customCode}
                    } catch (error) {
                        console.error('Error in custom head code:', error);
                    }
                `;

                    document.head.appendChild(customCodeScript);
                    console.log('JavaScript script added');
                } catch (jsError) {
                    console.error('Error adding JavaScript:', jsError);
                }
            }

            document.head.appendChild(endComment);

            // Update the status - pass a simple string rather than the full code
            try {
                updateTrackingStatus('customCode', 'Applied');
                console.log('Custom code status updated');

                // Delayed status update to ensure UI is refreshed
                setTimeout(function () {
                    updateTrackingStatus('customCode', 'Applied');
                }, 100);
            } catch (statusError) {
                console.error('Error updating status:', statusError);
            }

            return true;
        } catch (error) {
            console.error('Error applying custom code:', error);
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
            return false;
        }
    };

    // Function to remove tracking tool
    removeTrackingTool = function (tool) {
        console.log(`Removing tracking tool: ${tool}`);
        try {
            switch (tool) {
                case 'gtm':
                    removeScriptById('gtm-script');
                    removeScriptById('gtm-noscript');
                    updateTrackingStatus('gtm', null);
                    break;
                case 'ga':
                    removeScriptById('ga-script');
                    removeScriptById('ga-config-script');
                    updateTrackingStatus('ga', null);
                    break;
                case 'adobe':
                    removeScriptById('adobe-script');
                    removeScriptById('adobe-datalayer-script');
                    updateTrackingStatus('adobe', null);
                    break;
                case 'customCode':
                    removeExistingCustomCode();
                    // Clear the textarea
                    const textarea = document.getElementById('custom-head-code');
                    if (textarea) textarea.value = '';
                    updateTrackingStatus('customCode', null);
                    break;
            }

            // Remove from local storage
            removeTrackingConfiguration(tool);
            console.log(`${tool} removed successfully`);
        } catch (error) {
            console.error(`Error removing ${tool}:`, error);
        }
    };

    // Function to save tracking configuration
    saveTrackingConfiguration = function (tool, value) {
        console.log(`Saving ${tool} configuration`);
        try {
            // Get current configurations
            const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');

            // Update the specific tool
            configurations[tool] = value;

            // Save back to localStorage
            localStorage.setItem('trackingConfigurations', JSON.stringify(configurations));

            console.log(`Saved ${tool} configuration successfully:`, value);

            // Immediately update the status
            if (tool === 'customCode') {
                updateTrackingStatus(tool, 'Applied');
            } else {
                updateTrackingStatus(tool, value);
            }
        } catch (error) {
            console.error(`Error saving ${tool} configuration:`, error);
        }
    };

    // Function to remove tracking configuration
    removeTrackingConfiguration = function (tool) {
        console.log(`Removing ${tool} configuration from localStorage`);
        try {
            const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
            if (configurations[tool]) {
                delete configurations[tool];
                localStorage.setItem('trackingConfigurations', JSON.stringify(configurations));
                console.log(`${tool} configuration removed from localStorage`);
            } else {
                console.log(`No ${tool} configuration found in localStorage`);
            }
        } catch (error) {
            console.error(`Error removing ${tool} configuration:`, error);
        }
    };

    // Function to load tracking configurations
    loadTrackingConfigurations = function () {
        console.log('Loading tracking configurations from localStorage');
        try {
            const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
            console.log('Found configurations:', Object.keys(configurations));

            // Apply saved configurations with better error handling
            if (configurations.gtm) {
                try {
                    console.log('Loading GTM config:', configurations.gtm);
                    const gtmInput = document.getElementById('gtm-container-id');
                    if (gtmInput) gtmInput.value = configurations.gtm;
                    applyGTMContainer(configurations.gtm);
                } catch (e) {
                    console.error('Error loading GTM config:', e);
                }
            }

            if (configurations.ga) {
                try {
                    console.log('Loading GA config:', configurations.ga);
                    const gaInput = document.getElementById('ga-measurement-id');
                    if (gaInput) gaInput.value = configurations.ga;
                    applyGAMeasurement(configurations.ga);
                } catch (e) {
                    console.error('Error loading GA config:', e);
                }
            }

            if (configurations.adobe) {
                try {
                    console.log('Loading Adobe config:', configurations.adobe);
                    const adobeInput = document.getElementById('adobe-launch-url');
                    if (adobeInput) adobeInput.value = configurations.adobe;
                    applyAdobeLaunch(configurations.adobe);
                } catch (e) {
                    console.error('Error loading Adobe config:', e);
                }
            }

            if (configurations.customCode) {
                try {
                    console.log('Loading custom code from localStorage');
                    const customCode = configurations.customCode;

                    // Set the textarea value
                    const textarea = document.getElementById('custom-head-code');
                    if (textarea) {
                        textarea.value = customCode;
                        console.log('Custom code loaded into textarea');
                    }

                    // Apply with a slight delay to avoid initialization issues
                    setTimeout(() => {
                        try {
                            applyCustomCode(customCode);
                            console.log('Custom code applied from localStorage');
                        } catch (e) {
                            console.error('Error applying custom code:', e);
                        }
                    }, 200);

                } catch (e) {
                    console.error('Error loading custom code config:', e);
                }
            }

            // Refresh all statuses after a delay
            setTimeout(refreshAllTrackingStatuses, 500);
            console.log('Tracking configurations loaded successfully');
        } catch (error) {
            console.error('Error parsing tracking configurations:', error);
        }
    };

    // Function to initialize custom code buttons
    initCustomCodeButtons = function () {
        console.log('Initializing custom code buttons');
        try {
            // Find all trackable elements based on page-specific rules
            const trackableElements = findPageSpecificTrackableElements();

            // Add custom code buttons to all selected trackable elements
            trackableElements.forEach((element, index) => {
                // Skip if element already has a custom code button
                if (element.querySelector('.custom-code-button')) {
                    return;
                }

                // Generate a unique ID for this element if it doesn't have one
                if (!element.id) {
                    element.id = `trackable-element-${index}`;
                }

                // Create and add the custom code button
                const button = document.createElement('button');
                button.className = 'custom-code-button';
                button.textContent = '+ Code';
                button.setAttribute('data-element-id', element.id);
                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openCustomCodeModal(element.id);
                });

                // Append the button to the element
                element.appendChild(button);

                // Apply any saved custom code for this element
                applyElementCustomCode(element.id);
            });

            // Special case for cookie banner buttons
            const cookieBanner = document.getElementById('cookie-banner');
            if (cookieBanner) {
                const cookieButtons = cookieBanner.querySelectorAll('button');
                cookieButtons.forEach((button, index) => {
                    if (button.querySelector('.custom-code-button')) {
                        return;
                    }

                    if (!button.id) {
                        button.id = `cookie-button-${index}`;
                    }

                    const codeButton = document.createElement('button');
                    codeButton.className = 'custom-code-button';
                    codeButton.textContent = '+ Code';
                    codeButton.setAttribute('data-element-id', button.id);
                    codeButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        openCustomCodeModal(button.id);
                    });

                    button.appendChild(codeButton);
                    applyElementCustomCode(button.id);
                });
            }

            console.log('Custom code buttons initialized');
        } catch (error) {
            console.error('Error initializing custom code buttons:', error);
        }
    };

    // Function to find trackable elements
    findPageSpecificTrackableElements = function () {
        console.log('Finding page-specific trackable elements');
        try {
            const trackableElements = [];
            const processedElements = new Set(); // To prevent duplicates
            const currentPage = getCurrentPage();

            // Common elements across all pages
            addElementsIfExist('header a', trackableElements, processedElements);
            addElementsIfExist('footer a', trackableElements, processedElements);

            // Page-specific elements
            switch (currentPage) {
                case 'index':
                    addElementsIfExist('section.downloads', trackableElements, processedElements);
                    addElementsIfExist('section.downloads a', trackableElements, processedElements);
                    addElementsIfExist('section.newsletter', trackableElements, processedElements);
                    addElementsIfExist('section.newsletter button', trackableElements, processedElements);
                    addElementsIfExist('section.newsletter input', trackableElements, processedElements);
                    break;

                case 'products':
                    addElementsIfExist('.product-filter', trackableElements, processedElements);
                    addElementsIfExist('.product-filter select', trackableElements, processedElements);
                    addElementsIfExist('.product-list', trackableElements, processedElements);
                    addElementsIfExist('.product-list .product', trackableElements, processedElements);
                    addElementsIfExist('.add-to-cart', trackableElements, processedElements);
                    addElementsIfExist('.quantity-selector', trackableElements, processedElements);
                    addElementsIfExist('.quantity-selector input', trackableElements, processedElements);
                    addElementsIfExist('.quantity-selector button', trackableElements, processedElements);
                    break;

                case 'forms':
                    addElementsIfExist('form button[type="submit"]', trackableElements, processedElements);
                    addElementsIfExist('.search-form button', trackableElements, processedElements);
                    addElementsIfExist('input[type="checkbox"]', trackableElements, processedElements);
                    break;

                case 'media':
                    addElementsIfExist('main button', trackableElements, processedElements);
                    addElementsIfExist('main a', trackableElements, processedElements);
                    addElementsIfExist('.media-controls button', trackableElements, processedElements);
                    addElementsIfExist('.media-gallery img', trackableElements, processedElements);
                    break;

                case 'interactive':
                    addElementsIfExist('.interactive-card', trackableElements, processedElements);
                    addElementsIfExist('.interactive-card button', trackableElements, processedElements);
                    addElementsIfExist('.interactive-card a', trackableElements, processedElements);
                    addElementsIfExist('.interactive-element', trackableElements, processedElements);
                    break;

                case 'checkout':
                    addElementsIfExist('main button', trackableElements, processedElements);
                    addElementsIfExist('main form', trackableElements, processedElements);
                    addElementsIfExist('main input', trackableElements, processedElements);
                    addElementsIfExist('.checkout-steps .step', trackableElements, processedElements);
                    addElementsIfExist('.payment-options .option', trackableElements, processedElements);
                    break;
            }

            console.log(`Found ${trackableElements.length} trackable elements for page: ${currentPage}`);
            return trackableElements;
        } catch (error) {
            console.error('Error finding trackable elements:', error);
            return [];
        }
    };

    // Function to get current page
    getCurrentPage = function () {
        const path = window.location.pathname;
        if (path.includes('products.html')) return 'products';
        if (path.includes('forms.html')) return 'forms';
        if (path.includes('media.html')) return 'media';
        if (path.includes('interactive.html')) return 'interactive';
        if (path.includes('checkout.html')) return 'checkout';
        return 'index'; // Default
    };

    // Function to add elements if they exist
    addElementsIfExist = function (selector, elementsArray, processedSet) {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Skip if already processed
                if (processedSet.has(element)) {
                    return;
                }

                elementsArray.push(element);
                processedSet.add(element);
            });
        } catch (e) {
            console.error(`Error selecting ${selector}:`, e);
        }
    };

    // Function to open custom code modal
    openCustomCodeModal = function (elementId) {
        const modal = document.getElementById('custom-code-modal');
        const elementIdSpan = document.getElementById('element-id');
        const codeTextarea = document.getElementById('element-custom-code');

        elementIdSpan.textContent = elementId;

        // Load any existing custom code for this element
        const elementCodes = JSON.parse(localStorage.getItem('elementCustomCodes') || '{}');
        codeTextarea.value = elementCodes[elementId] || '';

        modal.classList.add('active');
    };

    // Function to save element custom code
    saveElementCustomCode = function (elementId, code) {
        try {
            const elementCodes = JSON.parse(localStorage.getItem('elementCustomCodes') || '{}');
            elementCodes[elementId] = code;
            localStorage.setItem('elementCustomCodes', JSON.stringify(elementCodes));

            // Apply the code to the element
            applyElementCustomCode(elementId);
            console.log(`Custom code saved for element: ${elementId}`);
        } catch (error) {
            console.error(`Error saving custom code for element ${elementId}:`, error);
        }
    };

    // Function to remove element custom code
    removeElementCustomCode = function (elementId) {
        try {
            const elementCodes = JSON.parse(localStorage.getItem('elementCustomCodes') || '{}');
            if (elementCodes[elementId]) {
                delete elementCodes[elementId];
                localStorage.setItem('elementCustomCodes', JSON.stringify(elementCodes));
            }

            // Remove any existing handler from the element
            const element = document.getElementById(elementId);
            if (element) {
                element.removeAttribute('data-has-custom-code');
                // Note: We can't easily remove event listeners, but we can mark that it no longer has custom code
            }
            console.log(`Custom code removed for element: ${elementId}`);
        } catch (error) {
            console.error(`Error removing custom code for element ${elementId}:`, error);
        }
    };

    // Function to apply element custom code
    applyElementCustomCode = function (elementId) {
        try {
            const element = document.getElementById(elementId);
            if (!element) return;

            const elementCodes = JSON.parse(localStorage.getItem('elementCustomCodes') || '{}');
            const code = elementCodes[elementId];

            if (code) {
                // Mark the element as having custom code
                element.setAttribute('data-has-custom-code', 'true');

                // Add event listener for clicks that executes the custom code
                if (!element.hasCustomCodeHandler) {
                    element.hasCustomCodeHandler = true;
                    element.addEventListener('click', function (event) {
                        // Get the latest code (in case it changed)
                        const currentCodes = JSON.parse(localStorage.getItem('elementCustomCodes') || '{}');
                        const currentCode = currentCodes[elementId];

                        if (currentCode) {
                            try {
                                // Execute the custom code with access to the event and element
                                const executeCode = new Function('event', 'element', currentCode);
                                executeCode(event, element);
                            } catch (error) {
                                console.error(`Error executing custom code for ${elementId}:`, error);
                            }
                        }
                    });
                }
                console.log(`Custom code applied to element: ${elementId}`);
            }
        } catch (error) {
            console.error(`Error applying custom code to element ${elementId}:`, error);
        }
    };

    // Make key functions available globally for debugging
    window.trackingManagerDebug = {
        applyCustomCode: applyCustomCode,
        removeExistingCustomCode: removeExistingCustomCode,
        updateTrackingStatus: updateTrackingStatus,
        refreshAllTrackingStatuses: refreshAllTrackingStatuses,
        loadTrackingConfigurations: loadTrackingConfigurations
    };

    console.log('Tracking Manager initialized and ready');
})();

// Enhanced tracking function that sends events to all configured tracking tools
window.trackEvent = function (category, action, label) {
    // Log the event to console (for debugging)
    console.log('Track Event:', { category, action, label });

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Always push to dataLayer regardless of cookie preferences
    // This ensures tracking works for testing purposes
    dataLayer.push({
        'event': 'custom_event',
        'event_category': category,
        'event_action': action,
        'event_label': label
    });

    // Check if analytics cookies are accepted
    const cookiePreferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{"essential":true,"analytics":true,"marketing":false}');

    // If analytics cookies are not accepted, don't send to analytics platforms
    if (!cookiePreferences.analytics) {
        console.log('Analytics tracking disabled by user preferences (but dataLayer push completed)');
        return;
    }

    // If using Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }

    // If using Adobe Analytics via Adobe Client Data Layer
    if (typeof adobeDataLayer !== 'undefined') {
        adobeDataLayer.push({
            'event': 'custom_event',
            'eventInfo': {
                'category': category,
                'action': action,
                'label': label
            }
        });
    }
};
console.log('Tracking-Manager loaded');