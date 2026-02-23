import { useEffect, useState } from "react";

export function GoogleTranslate() {
    const [currentLang, setCurrentLang] = useState("id");

    useEffect(() => {
        // Check initial language from cookie
        const match = document.cookie.match(/googtrans=\/([^/]+)\/([^;]+)/);
        const targetLang = match ? match[2] : "id";
        setCurrentLang(targetLang);

        // Initial script injection
        const scriptId = "google-translate-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.body.appendChild(script);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "id",
                        includedLanguages: "id,en",
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            };
        }
    }, []);

    const handleLanguageChange = (lang) => {
        const domain = window.location.hostname;

        // Helper to set cookie on domain and potential parent domains
        const setCookie = (name, value, days) => {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }

            // Set on current domain
            document.cookie = name + "=" + (value || "") + expires + "; path=/";

            // Try setting on top-level domain parts just in case (e.g. .vercel.app)
            const parts = domain.split('.');
            if (parts.length > 1) {
                const topLevel = '.' + parts.slice(-2).join('.');
                document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + topLevel;
            }

            document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + domain;
        };

        const deleteCookie = (name) => {
            document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            const parts = domain.split('.');
            if (parts.length > 1) {
                const topLevel = '.' + parts.slice(-2).join('.');
                document.cookie = name + '=; Path=/; Domain=' + topLevel + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
            document.cookie = name + '=; Path=/; Domain=' + domain + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };


        if (lang === "id") {
            // To revert to original, we delete the googtrans cookie
            deleteCookie("googtrans");
            setCurrentLang("id");
        } else {
            // Set cookie to translate from ID to EN
            setCookie("googtrans", "/id/en", 7); // 7 days
            setCurrentLang("en");
        }

        // Reload to apply changes
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-full px-1 py-1 border border-slate-700/50 mr-4">
            <button
                onClick={() => handleLanguageChange("id")}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentLang === "id"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50"
                    }`}
                title="Bahasa Indonesia"
            >
                ID
            </button>
            <button
                onClick={() => handleLanguageChange("en")}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentLang === "en"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50"
                    }`}
                title="English"
            >
                EN
            </button>

            {/* 
        This div is required for Google Translate to initialize. 
        We use absolute positioning to hide it without using display:none 
        because sometimes display:none prevents initialization.
      */}
            <div id="google_translate_element" className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none" />

            {/* CSS overrides to hide Google UI elements */}
            <style>{`
        body { top: 0px !important; position: static !important; }
        .goog-te-banner-frame { display: none !important; }
        .goog-te-gadget-simple { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        #goog-gt-tt { display: none !important; visibility: hidden !important; }
        .goog-te-balloon-frame { display: none !important; }
        font { background-color: transparent !important; box-shadow: none !important; }
        
        /* Specific Fix for Banner Frame */
        iframe.goog-te-banner-frame { display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; }
        
        /* Fix for body shift */
        body > .skiptranslate { display: none !important; }
      `}</style>
        </div>
    );
}
