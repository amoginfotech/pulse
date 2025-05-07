// Cookie Consent Handler
class CookieConsent {
    constructor() {
        this.cookieName = 'cookie_consent';
        this.consentBanner = null;
        this.init();
    }

    init() {
        if (!this.hasUserConsent()) {
            this.createConsentBanner();
        }
    }

    createConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <p>We use cookies to enhance your experience. Chrome is moving towards a cookie-less experience. 
                   You can choose to disable third-party cookies.</p>
                <div class="cookie-consent-buttons">
                    <button class="accept-all-btn">Accept All</button>
                    <button class="essential-only-btn">Essential Only</button>
                </div>
            </div>
        `;

        // Add banner styles
        const styles = document.createElement('style');
        styles.textContent = `
            .cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 1rem;
                z-index: 9999;
                font-family: 'Open Sans', sans-serif;
            }
            .cookie-consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }
            .cookie-consent-buttons {
                display: flex;
                gap: 1rem;
            }
            .cookie-consent-banner button {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
            }
            .accept-all-btn {
                background: #4CAF50;
                color: white;
            }
            .essential-only-btn {
                background: #f1f1f1;
                color: #333;
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(banner);
        this.consentBanner = banner;

        // Add event listeners
        banner.querySelector('.accept-all-btn').addEventListener('click', () => this.setConsent(true));
        banner.querySelector('.essential-only-btn').addEventListener('click', () => this.setConsent(false));
    }

    setConsent(allowAll) {
        const consent = {
            essential: true,
            thirdParty: allowAll,
            timestamp: new Date().toISOString()
        };

        // Set cookie with 6 month expiry
        const sixMonths = 180 * 24 * 60 * 60 * 1000;
        const expires = new Date(Date.now() + sixMonths).toUTCString();
        document.cookie = `${this.cookieName}=${JSON.stringify(consent)}; expires=${expires}; path=/; SameSite=Lax`;

        if (this.consentBanner) {
            this.consentBanner.remove();
        }

        // Reload page to apply cookie settings
        window.location.reload();
    }

    hasUserConsent() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=').map(c => c.trim());
            if (name === this.cookieName) {
                return true;
            }
        }
        return false;
    }

    getConsentStatus() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=').map(c => c.trim());
            if (name === this.cookieName) {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    }
}

// Initialize cookie consent
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
});