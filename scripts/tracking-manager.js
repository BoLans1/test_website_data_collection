// Tracking Manager for Analytics Testing Playground
(function () {
    // Initialize tracking manager after DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        initTrackingManager();
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
                    </div>
                    <div class="tracking-manager-status">
                        <h3>Active Tracking Solutions:</h3>
                        <ul id="active-tracking">
                            <li id="gtm-status">Google Tag Manager: <span>Not configured</span></li>
                            <li id="ga-status">Google Analytics: <span>Not configured</span></li>
                            <li id="adobe-status">Adobe Launch: <span>Not configured</span></li>
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
        const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
        configurations[tool] = value;
        localStorage.setItem('trackingConfigurations', JSON.stringify(configurations));
    }

    function removeTrackingConfiguration(tool) {
        const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');
        if (configurations[tool]) {
            delete configurations[tool];
            localStorage.setItem('trackingConfigurations', JSON.stringify(configurations));
        }
    }

    function loadTrackingConfigurations() {
        const configurations = JSON.parse(localStorage.getItem('trackingConfigurations') || '{}');

        // Apply saved configurations
        if (configurations.gtm) {
            document.getElementById('gtm-container-id').value = configurations.gtm;
            applyGTMContainer(configurations.gtm);
        }

        if (configurations.ga) {
            document.getElementById('ga-measurement-id').value = configurations.ga;
            applyGAMeasurement(configurations.ga);
        }

        if (configurations.adobe) {
            document.getElementById('adobe-launch-url').value = configurations.adobe;
            applyAdobeLaunch(configurations.adobe);
        }
    }

    // Enhanced tracking function that sends events to all configured tracking tools
    window.trackEvent = function (category, action, label) {
        // Check if analytics cookies are accepted
        const cookiePreferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{"essential":true,"analytics":false,"marketing":false}');

        if (!cookiePreferences.analytics) {
            console.log('Analytics tracking disabled by user preferences');
            return;
        }

        // Log the event to console (for debugging)
        console.log('Track Event:', { category, action, label });

        // Google Analytics via gtag
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }

        // Google Tag Manager via dataLayer
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                'event': 'custom_event',
                'event_category': category,
                'event_action': action,
                'event_label': label
            });
        }

        // Adobe Analytics via Adobe Client Data Layer
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
})();
