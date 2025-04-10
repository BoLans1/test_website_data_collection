// Enhanced Tracking Manager for Analytics Testing Playground
(function () {
    // Initialize tracking manager after DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        initTrackingManager();
        initCustomCodeButtons();
    });

    function initTrackingManager() {
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
    }

    function insertTrackingManagerUI() {
        const header = document.querySelector('header');
        if (!header) return;

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
    }

    function initEventListeners() {
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
        // Replace the current custom code form submission handler
        const customCodeForm = document.getElementById('custom-code-form');
        if (customCodeForm) {
            customCodeForm.addEventListener('submit', function (e) {
                e.preventDefault();
                console.log('Custom code form submitted');

                const customCode = document.getElementById('custom-head-code').value.trim();
                if (customCode) {
                    console.log('Applying and saving custom code...');

                    // Apply the code
                    if (applyCustomCode(customCode)) {
                        // Explicitly save the configuration
                        saveTrackingConfiguration('customCode', customCode);
                        console.log('Custom code saved to localStorage');

                        // Verify it was saved
                        const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
                        console.log('Verification - saved configurations:', configurations);
                    }
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
    }

    function applyGTMContainer(containerId) {
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
    }

    function applyGAMeasurement(measurementId) {
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
    }

    function applyAdobeLaunch(launchUrl) {
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
    }

    // Replace the current applyCustomCode function with this
    function applyCustomCode(customCode) {
        console.log('applyCustomCode function called with:', customCode);

        // Remove existing custom code if any
        removeExistingCustomCode();
        console.log('Removed existing custom code');

        try {
            // Detect if the input is HTML (starts with '<')
            const isHtml = customCode.trim().startsWith('<');
            console.log('Is HTML content:', isHtml);

            // Modify the HTML handling in the applyCustomCode function
            if (isHtml) {
                console.log('Processing HTML content');

                // Special case for OneTrust and similar third-party scripts
                if (customCode.includes('<script src=') || customCode.includes('</script>')) {
                    console.log('Detected script tags in HTML, processing specially');

                    // Create a div to hold the raw code temporarily
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = customCode;

                    // Process each script element
                    const scriptElements = tempDiv.querySelectorAll('script');
                    scriptElements.forEach((script, index) => {
                        // Create a new script element
                        const newScript = document.createElement('script');
                        newScript.id = `custom-script-${index}`;

                        // Copy attributes
                        Array.from(script.attributes).forEach(attr => {
                            newScript.setAttribute(attr.name, attr.value);
                        });

                        // Copy content if any
                        if (script.textContent) {
                            newScript.textContent = script.textContent;
                        }

                        // If it has a src attribute, we need to handle it specially
                        if (script.src) {
                            newScript.src = script.src;
                            newScript.async = true;
                        }

                        // Add to head
                        document.head.appendChild(newScript);
                        console.log(`Added script ${index} to head`, newScript);
                    });

                    // For non-script content, create a container
                    const nonScriptContent = customCode.replace(/<script[\s\S]*?<\/script>/g, '');
                    if (nonScriptContent.trim()) {
                        const containerDiv = document.createElement('div');
                        containerDiv.id = 'custom-head-code-container';
                        containerDiv.style.display = 'none';
                        containerDiv.innerHTML = nonScriptContent;
                        document.head.appendChild(containerDiv);
                        console.log('Added non-script content to head');
                    }
                } else {
                    // Original handling for other HTML content
                    if (customCode.includes('<style') || customCode.includes('</style>')) {
                        console.log('Adding as style element');
                        const styleEl = document.createElement('style');
                        styleEl.id = 'custom-head-code-script';
                        styleEl.textContent = customCode.replace(/<\/?style[^>]*>/g, '');
                        document.head.appendChild(styleEl);
                    } else {
                        console.log('Adding as HTML div');
                        const containerDiv = document.createElement('div');
                        containerDiv.id = 'custom-head-code-script';
                        containerDiv.style.display = 'none';
                        containerDiv.innerHTML = customCode;
                        document.head.appendChild(containerDiv);
                    }
                }
            }

            // Add marker comments for easier removal
            const beginComment = document.createComment(' BEGIN CUSTOM CODE ');
            const endComment = document.createComment(' END CUSTOM CODE ');

            const codeElement = document.getElementById('custom-head-code-script');
            if (codeElement) {
                codeElement.parentNode.insertBefore(beginComment, codeElement);
                if (codeElement.nextSibling) {
                    codeElement.parentNode.insertBefore(endComment, codeElement.nextSibling);
                } else {
                    codeElement.parentNode.appendChild(endComment);
                }
                console.log('Added comment markers around custom code');
            }

            // Update status
            updateTrackingStatus('customCode', 'Applied');
            console.log('Updated tracking status');

            return true; // Signal success
        } catch (error) {
            console.error('Error in applyCustomCode:', error);
            return false;
        }
    }

    // Make it accessible globally for debugging
    window.applyCustomCode = applyCustomCode;
    function removeExistingCustomCode() {
        // Remove any existing custom code
        removeScriptById('custom-head-code-script');

        // Remove comment markers
        let foundBegin = false;
        let nodesToRemove = [];
        let beginNode = null;
        let endNode = null;

        // Find our marker comments and all nodes in between
        for (let i = 0; i < document.head.childNodes.length; i++) {
            const node = document.head.childNodes[i];

            if (node.nodeType === 8) { // Comment node
                if (node.nodeValue.trim() === 'BEGIN CUSTOM CODE') {
                    foundBegin = true;
                    beginNode = node;
                    continue;
                }
                else if (node.nodeValue.trim() === 'END CUSTOM CODE') {
                    endNode = node;
                    break;
                }
            }

            if (foundBegin) {
                nodesToRemove.push(node);
            }
        }

        // Remove the nodes between our markers
        nodesToRemove.forEach(node => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });

        // Remove the marker comments
        if (beginNode && beginNode.parentNode) {
            beginNode.parentNode.removeChild(beginNode);
        }
        if (endNode && endNode.parentNode) {
            endNode.parentNode.removeChild(endNode);
        }
    }

    function removeTrackingTool(tool) {
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
    }

    function removeScriptById(id) {
        const script = document.getElementById(id);
        if (script) {
            script.parentNode.removeChild(script);
        }
    }

    function updateTrackingStatus(tool, value) {
        const statusElement = document.getElementById(`${tool}-status`);
        if (statusElement) {
            const statusText = statusElement.querySelector('span');
            if (statusText) {
                if (value) {
                    statusText.textContent = value;
                    statusText.style.color = 'green';
                } else {
                    statusText.textContent = 'Not configured';
                    statusText.style.color = '';
                }
            }
        }
    }

    function saveTrackingConfiguration(tool, value) {
        console.log(`Saving configuration for ${tool}:`, value);
        try {
            const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
            configurations[tool] = value;
            localStorage.setItem('trackingConfigurations', JSON.stringify(configurations));
            console.log('Saved configurations:', configurations);

            // Verify it was saved correctly
            const savedConfigs = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
            console.log('Verification - Loaded configurations:', savedConfigs);
        } catch (error) {
            console.error('Error saving tracking configuration:', error);
        }
    }

    function removeTrackingConfiguration(tool) {
        const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
        if (configurations[tool]) {
            delete configurations[tool];
            localStorage.setItem('trackingConfigurations', JSON.stringify(configurations));
        }
    }

    function loadTrackingConfigurations() {
        console.log('Loading tracking configurations from localStorage');
        try {
            const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
            console.log('Found configurations:', configurations);

            // Apply saved configurations
            if (configurations.gtm) {
                console.log('Applying saved GTM configuration');
                document.getElementById('gtm-container-id').value = configurations.gtm;
                applyGTMContainer(configurations.gtm);
            }

            if (configurations.ga) {
                console.log('Applying saved GA configuration');
                document.getElementById('ga-measurement-id').value = configurations.ga;
                applyGAMeasurement(configurations.ga);
            }

            if (configurations.adobe) {
                console.log('Applying saved Adobe configuration');
                document.getElementById('adobe-launch-url').value = configurations.adobe;
                applyAdobeLaunch(configurations.adobe);
            }

            if (configurations.customCode) {
                console.log('Applying saved custom code');
                document.getElementById('custom-head-code').value = configurations.customCode;

                // Use setTimeout to ensure the custom code is applied after a slight delay
                // This can help with timing issues during page initialization
                setTimeout(function () {
                    applyCustomCode(configurations.customCode);
                    console.log('Custom code applied from localStorage');
                }, 100);
            } else {
                console.log('No custom code found in configurations');
            }
        } catch (error) {
            console.error('Error loading tracking configurations:', error);
        }
    }

    // Custom code for elements functionality
    function initCustomCodeButtons() {
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
    }

    function findPageSpecificTrackableElements() {
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

        return trackableElements;
    }

    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('products.html')) return 'products';
        if (path.includes('forms.html')) return 'forms';
        if (path.includes('media.html')) return 'media';
        if (path.includes('interactive.html')) return 'interactive';
        if (path.includes('checkout.html')) return 'checkout';
        return 'index'; // Default
    }

    function addElementsIfExist(selector, elementsArray, processedSet) {
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
    }

    function openCustomCodeModal(elementId) {
        const modal = document.getElementById('custom-code-modal');
        const elementIdSpan = document.getElementById('element-id');
        const codeTextarea = document.getElementById('element-custom-code');

        elementIdSpan.textContent = elementId;

        // Load any existing custom code for this element
        const elementCodes = JSON.parse(localStorage.getItem('elementCustomCodes') || '{}');
        codeTextarea.value = elementCodes[elementId] || '';

        modal.classList.add('active');
    }

    function saveElementCustomCode(elementId, code) {
        const elementCodes = JSON.parse(localStorage.getItem('elementCustomCodes') || '{}');
        elementCodes[elementId] = code;
        localStorage.setItem('elementCustomCodes', JSON.stringify(elementCodes));

        // Apply the code to the element
        applyElementCustomCode(elementId);
    }

    function removeElementCustomCode(elementId) {
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
    }

    function applyElementCustomCode(elementId) {
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
        }
    }
})();
console.log('Tracking Manager script loaded!');


// Debugging code
document.addEventListener('DOMContentLoaded', function () {
    console.log('Debugging custom code functionality');

    // Check if form exists
    const customCodeForm = document.getElementById('custom-code-form');
    console.log('Custom code form found:', customCodeForm);

    if (customCodeForm) {
        console.log('Adding test event listener');

        // Add a separate click handler to the submit button as a test
        const applyButton = customCodeForm.querySelector('button[type="submit"]');
        console.log('Apply button found:', applyButton);

        if (applyButton) {
            applyButton.addEventListener('click', function (e) {
                console.log('Apply button clicked!');
                console.log('Custom code value:', document.getElementById('custom-head-code').value);
            });
        }

        // Test the form submission directly
        customCodeForm.addEventListener('submit', function (e) {
            console.log('Form submit event triggered!');
            e.preventDefault();

            const customCode = document.getElementById('custom-head-code').value.trim();
            console.log('Custom code to apply:', customCode);

            try {
                console.log('Attempting to apply custom code...');
                window.applyCustomCode(customCode); // Try using window.applyCustomCode
                console.log('Custom code applied successfully');
            } catch (error) {
                console.error('Error applying custom code:', error);
            }
        });
    }
});

// Expose key functions for debugging
window.debugTrackingManager = {
    applyCustomCode: applyCustomCode,
    removeExistingCustomCode: removeExistingCustomCode,
    updateTrackingStatus: updateTrackingStatus,
    saveTrackingConfiguration: saveTrackingConfiguration
};

// Add at the end of the file
document.addEventListener('DOMContentLoaded', function () {
    console.log('Checking localStorage for custom code on page load');
    const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
    console.log('Found configurations:', configurations);

    if (configurations.customCode) {
        console.log('Found custom code in localStorage:', configurations.customCode);
    } else {
        console.warn('No custom code found in localStorage');
    }
});