document.addEventListener('DOMContentLoaded', () => {
    const fontGrid = document.getElementById('font-grid');
    const searchInput = document.getElementById('search');
    const exploreBtn = document.querySelector('.hero-btn');
    const navExploreLink = document.querySelector('nav a[href="#font-display-section"]');
    const filterControls = document.querySelector('.filter-controls');
    const globalSampleTextInput = document.getElementById('global-sample-text');

    // Modal elements
    const modal = document.getElementById('font-detail-modal');
    const modalFontName = document.getElementById('modal-font-name');
    const modalSampleText = document.getElementById('modal-sample-text');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalFontLink = document.getElementById('modal-font-link');
    const modalOverlay = document.querySelector('.modal-overlay');

    let cardObserver;
    let favorites = [];
    let loadedFontFamilies = new Set();
    let currentSampleText = 'The quick brown fox jumps over the lazy dog.';
    let currentFilters = {
        source: 'all',
        category: 'all',
        show: 'all'
    };

    // For a real application, you would fetch this list from the Google Fonts API.
    // You would need an API key for that.
    const fonts = [
        // Google Fonts - Sans-serif
        { family: 'Roboto', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Roboto' },
        { family: 'Open Sans', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Open+Sans' },
        { family: 'Lato', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Lato' },
        { family: 'Montserrat', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Montserrat' },
        { family: 'Poppins', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Poppins' },
        { family: 'Nunito', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Nunito' },
        { family: 'Work Sans', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Work+Sans' },
        { family: 'Inter', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Inter' },
        { family: 'Manrope', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Manrope' },
        { family: 'Outfit', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Outfit' },
        { family: 'Sora', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Sora' },
        { family: 'Syne', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Syne' },
        { family: 'DM Sans', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/DM+Sans' },
        { family: 'Plus Jakarta Sans', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Plus+Jakarta+Sans' },
        { family: 'Urbanist', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Urbanist' },
        { family: 'Figtree', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Figtree' },
        { family: 'Be Vietnam Pro', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Be+Vietnam+Pro' },
        { family: 'Rubik', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Rubik' },
        { family: 'Quicksand', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Quicksand' },
        { family: 'Josefin Sans', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Josefin+Sans' },
        { family: 'Barlow', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Barlow' },
        { family: 'Heebo', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Heebo' },
        { family: 'Karla', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Karla' },
        { family: 'Lexend', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Lexend' },
        { family: 'Public Sans', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Public+Sans' },
        { family: 'Red Hat Display', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Red+Hat+Display' },
        { family: 'Comfortaa', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Comfortaa' },
        { family: 'Exo 2', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Exo+2' },
        { family: 'Kanit', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Kanit' },

        // Google Fonts - Serif
        { family: 'Playfair Display', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Playfair+Display' },
        { family: 'Merriweather', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Merriweather' },
        { family: 'Lora', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Lora' },
        { family: 'PT Serif', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/PT+Serif' },
        { family: 'Source Serif Pro', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Source+Serif+Pro' },
        { family: 'EB Garamond', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/EB+Garamond' },
        { family: 'Bitter', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Bitter' },
        { family: 'Crimson Text', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Crimson+Text' },
        { family: 'Fraunces', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Fraunces' },
        { family: 'Newsreader', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Newsreader' },
        { family: 'Bodoni Moda', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Bodoni+Moda' },
        { family: 'Cormorant Garamond', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Cormorant+Garamond' },
        { family: 'Domine', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Domine' },
        { family: 'Libre Baskerville', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Libre+Baskerville' },
        { family: 'Arvo', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Arvo' },
        { family: 'Cardo', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Cardo' },
        { family: 'Neuton', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Neuton' },
        { family: 'Vollkorn', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Vollkorn' },
        { family: 'Alegreya', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Alegreya' },
        { family: 'Zilla Slab', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Zilla+Slab' },

        // Google Fonts - Display
        { family: 'Oswald', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Oswald' },
        { family: 'Raleway', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Raleway' },
        { family: 'Anton', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Anton' },
        { family: 'Bebas Neue', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Bebas+Neue' },
        { family: 'Archivo Black', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Archivo+Black' },
        { family: 'Unbounded', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Unbounded' },
        { family: 'Righteous', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Righteous' },
        { family: 'Lobster', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Lobster' },
        { family: 'Alfa Slab One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Alfa+Slab+One' },
        { family: 'Staatliches', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Staatliches' },
        { family: 'Fugaz One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Fugaz+One' },
        { family: 'Tilt Prism', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Tilt+Prism' },
        { family: 'Monoton', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Monoton' },
        { family: 'Bungee', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Bungee' },
        { family: 'Abril Fatface', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Abril+Fatface' },
        { family: 'Passion One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Passion+One' },
        { family: 'Fredoka One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Fredoka+One' },
        { family: 'Ultra', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Ultra' },
        { family: 'Sigmar One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Sigmar+One' },
        { family: 'Changa One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Changa+One' },
        { family: 'Shrikhand', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Shrikhand' },

        // Google Fonts - Monospace
        { family: 'Space Grotesk', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Space+Grotesk' },
        { family: 'Source Code Pro', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Source+Code+Pro' },
        { family: 'JetBrains Mono', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/JetBrains+Mono' },
        { family: 'Fira Code', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Fira+Code' },
        { family: 'IBM Plex Mono', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/IBM+Plex+Mono' },
        { family: 'Major Mono Display', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Major+Mono+Display' },
        { family: 'Rubik Mono One', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Rubik+Mono+One' },
        { family: 'VT323', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/VT323' },
        { family: 'Cutive Mono', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Cutive+Mono' },
        { family: 'Nanum Gothic Coding', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Nanum+Gothic+Coding' },
        { family: 'Xanh Mono', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Xanh+Mono' },

        // Google Fonts - Handwriting / Script
        { family: 'Caveat', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Caveat' },
        { family: 'Pacifico', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Pacifico' },
        { family: 'Dancing Script', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Dancing+Script' },
        { family: 'Shadows Into Light', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Shadows+Into+Light' },
        { family: 'Sacramento', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Sacramento' },
        { family: 'Great Vibes', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Great+Vibes' },
        { family: 'Lobster Two', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Lobster+Two' },
        { family: 'Cookie', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Cookie' },
        { family: 'Permanent Marker', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Permanent+Marker' },
        { family: 'Indie Flower', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Indie+Flower' },
        { family: 'Satisfy', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Satisfy' },
        { family: 'Patrick Hand', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Patrick+Hand' },
        { family: 'Gochi Hand', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Gochi+Hand' },
        { family: 'Kalam', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Kalam' },

        // Adobe Fonts (with proxies for demo)
        { family: 'Acumin Pro', source: 'Adobe Fonts', category: 'sans-serif', url: 'https://fonts.adobe.com/fonts/acumin' },
        { family: 'Brandon Grotesque', source: 'Adobe Fonts', category: 'sans-serif', url: 'https://fonts.adobe.com/fonts/brandon-grotesque' },
        { family: 'Myriad Pro', source: 'Adobe Fonts', category: 'sans-serif', url: 'https://fonts.adobe.com/fonts/myriad' },
        { family: 'Minion Pro', source: 'Adobe Fonts', category: 'serif', url: 'https://fonts.adobe.com/fonts/minion' },
        { family: 'Lust Script', source: 'Adobe Fonts', category: 'handwriting', url: 'https://fonts.adobe.com/fonts/lust-script' },

        // Other Foundries (with proxies for demo)
        { family: 'Cabinet Grotesk', source: 'Other', category: 'sans-serif', url: 'https://www.fontshare.com/fonts/cabinet-grotesk' },
        { family: "Clash Display", source: "Other", category: 'display', url: 'https://www.fontshare.com/fonts/clash-display' },
        { family: 'Satoshi', source: 'Other', category: 'sans-serif', url: 'https://www.fontshare.com/fonts/satoshi' },
        { family: 'Switzer', source: 'Other', category: 'sans-serif', url: 'https://www.fontshare.com/fonts/switzer' },
        { family: 'General Sans', source: 'Other', category: 'sans-serif', url: 'https://www.fontshare.com/fonts/general-sans' },

        // MORE Google Fonts - Sans-serif
        { family: 'Jost', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Jost' },
        { family: 'Saira', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Saira' },
        { family: 'Gantari', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Gantari' },
        { family: 'Onest', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Onest' },
        { family: 'Expletus Sans', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Expletus+Sans' },
        { family: 'Libre Franklin', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Libre+Franklin' },
        { family: 'Prompt', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Prompt' },
        { family: 'Overpass', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Overpass' },
        { family: 'Commissioner', source: 'Google Fonts', category: 'sans-serif', url: 'https://fonts.google.com/specimen/Commissioner' },

        // MORE Google Fonts - Serif
        { family: 'Playfair Display SC', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Playfair+Display+SC' },
        { family: 'Cormorant', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Cormorant' },
        { family: 'Spectral', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Spectral' },
        { family: 'Rozha One', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Rozha+One' },
        { family: 'Prata', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Prata' },
        { family: 'Caudex', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Caudex' },
        { family: 'Noticia Text', source: 'Google Fonts', category: 'serif', url: 'https://fonts.google.com/specimen/Noticia+Text' },

        // MORE Google Fonts - Display
        { family: 'DM Serif Display', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/DM+Serif+Display' },
        { family: 'Unica One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Unica+One' },
        { family: 'Syncopate', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Syncopate' },
        { family: 'Yeseva One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Yeseva+One' },
        { family: 'Poiret One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Poiret+One' },
        { family: 'Graduate', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Graduate' },
        { family: 'Lilita One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Lilita+One' },
        { family: 'Rowdies', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Rowdies' },
        { family: 'Bungee Shade', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Bungee+Shade' },
        { family: 'Faster One', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Faster+One' },
        { family: 'Wallpoet', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Wallpoet' },
        { family: 'Megrim', source: 'Google Fonts', category: 'display', url: 'https://fonts.google.com/specimen/Megrim' },

        // MORE Google Fonts - Handwriting / Script
        { family: 'Marck Script', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Marck+Script' },
        { family: 'Kaushan Script', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Kaushan+Script' },
        { family: 'Bad Script', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Bad+Script' },
        { family: 'Tangerine', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Tangerine' },
        { family: 'Homemade Apple', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Homemade+Apple' },
        { family: 'Rock Salt', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Rock+Salt' },
        { family: 'Cedarville Cursive', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/Cedarville+Cursive' },
        { family: 'La Belle Aurore', source: 'Google Fonts', category: 'handwriting', url: 'https://fonts.google.com/specimen/La+Belle+Aurore' },

            // MORE Google Fonts - Monospace
        { family: 'Roboto Mono', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Roboto+Mono' },
        { family: 'Inconsolata', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Inconsolata' },
        { family: 'Share Tech Mono', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Share+Tech+Mono' },
        { family: 'Space Mono', source: 'Google Fonts', category: 'monospace', url: 'https://fonts.google.com/specimen/Space+Mono' },

        // MORE Adobe Fonts (with proxies for demo)
        { family: 'Proxima Nova', source: 'Adobe Fonts', category: 'sans-serif', url: 'https://fonts.adobe.com/fonts/proxima-nova' },
        { family: 'Trade Gothic', source: 'Adobe Fonts', category: 'display', url: 'https://fonts.adobe.com/fonts/trade-gothic' },
        { family: 'Bickham Script Pro', source: 'Adobe Fonts', category: 'handwriting', url: 'https://fonts.adobe.com/fonts/bickham-script' },

        // MORE Other Foundries (with proxies for demo)
        { family: 'Neue Haas Grotesk', source: 'Other', category: 'sans-serif', url: 'https://www.monotype.com/fonts/neue-haas-grotesk' },
        { family: 'Euclid Circular A', source: 'Other', category: 'sans-serif', url: 'https://www.swisstypefaces.com/font/euclid' },
        { family: 'GT America', source: 'Other', category: 'sans-serif', url: 'https://www.grillitype.com/font/gt-america' }
    ];

    const fontsPerPage = 10; // Changed to 10 to show 2 rows of 5
    let currentPage = 1;

    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    // --- Favorites Functions ---
    function loadFavorites() {
        favorites = JSON.parse(localStorage.getItem('fontfit_favorites')) || [];
    }

    function saveFavorites() {
        localStorage.setItem('fontfit_favorites', JSON.stringify(favorites));
    }

    function toggleFavorite(fontFamily, btnElement) {
        const index = favorites.indexOf(fontFamily);
        const isCurrentlyFavorited = index > -1;

        if (isCurrentlyFavorited) {
            favorites.splice(index, 1);
        } else {
            favorites.push(fontFamily);
        }
        saveFavorites();

        // If we are in the "My Favorites" view and just unfavorited a font,
        // we must re-render the list to remove the card.
        if (currentFilters.show === 'favorites' && isCurrentlyFavorited) {
            displayFonts();
            return; // Exit early
        }

        // Otherwise, we can just toggle the class on the button for an
        // instant visual update without re-rendering the whole grid.
        if (btnElement) {
            btnElement.classList.toggle('favorited', !isCurrentlyFavorited);
        }
    }

    function getFilteredFonts() {
        const searchTerm = searchInput.value.toLowerCase();
        
        let sourceFonts = fonts;
        // First, filter by favorites if that view is selected
        if (currentFilters.show === 'favorites') {
            sourceFonts = fonts.filter(font => favorites.includes(font.family));
        }

        // Then, apply the other filters on the result
        return sourceFonts.filter(font => {
            const matchesSearch = font.family.toLowerCase().includes(searchTerm);
            const matchesSource = currentFilters.source === 'all' || font.source === currentFilters.source;
            const matchesCategory = currentFilters.category === 'all' || font.category === currentFilters.category;
            return matchesSearch && matchesSource && matchesCategory;
        });
    }

    function setupFontCardObserver() {
        const options = {
            root: null, // Use the viewport as the root
            rootMargin: '0px 0px -50px 0px', // Trigger animation a bit early
            threshold: 0.1 // Trigger when 10% of the card is visible
        };

        cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, options);
    }

    function displayFonts() {
        fontGrid.innerHTML = '';
        const filteredFonts = getFilteredFonts();
        const totalPages = Math.ceil(filteredFonts.length / fontsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        const startIdx = (currentPage - 1) * fontsPerPage;
        const endIdx = startIdx + fontsPerPage;
        const fontsToDisplay = filteredFonts.slice(startIdx, endIdx);

        // --- Performance Improvement: Batch Font Loading ---
        const fontsToLoad = fontsToDisplay
            .filter(font => !loadedFontFamilies.has(font.family))
            .map(font => `family=${getFontFamilyForAPI(font)}`);

        if (fontsToLoad.length > 0) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            // Google Fonts API can handle multiple families in one request
            fontLink.href = `https://fonts.googleapis.com/css2?${fontsToLoad.join('&')}&display=swap`;
            document.head.appendChild(fontLink);
            
            // Add the newly requested fonts to our set of loaded fonts
            fontsToDisplay.forEach(font => loadedFontFamilies.add(font.family));
        }

        fontsToDisplay.forEach((font, index) => {
            // Create the font card
            const fontCard = document.createElement('div');
            fontCard.className = 'font-card';

            // Staggered animation delay
            fontCard.style.transitionDelay = `${index * 100}ms`;

            const cardHeader = document.createElement('div');
            cardHeader.className = 'font-card-header';

            const fontName = document.createElement('h3');
            fontName.textContent = font.family;
            fontName.style.fontFamily = `'${font.family.split(' (')[0]}', sans-serif`;
            fontName.title = 'Click to copy font name'; // Add a helpful tooltip

            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-btn';
            // Using an SVG for the star icon for easy styling
            favoriteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

            if (favorites
                .includes(font.family)) {
                favoriteBtn.classList.add('favorited');
            }
            favoriteBtn.addEventListener('click', (e) => {
                // Pass the button element for targeted DOM updates
                toggleFavorite(font.family, e.currentTarget);
            });
            // Add click-to-copy functionality
            fontName.addEventListener('click', () => {
                navigator.clipboard.writeText(font.family).then(() => {
                    const originalText = fontName.textContent;
                    fontName.textContent = 'Copied!';
                    fontName.classList.add('copied');

                    setTimeout(() => {
                        fontName.textContent = originalText;
                        fontName.classList.remove('copied');
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy font name:', err);
                });
            });

            const sampleText = document.createElement('p');
            sampleText.className = 'font-sample';
            sampleText.textContent = currentSampleText;
            sampleText.style.fontFamily = `'${font.family.split(' (')[0]}', sans-serif`;
            sampleText.contentEditable = true;

            cardHeader.appendChild(fontName);
            cardHeader.appendChild(favoriteBtn);
            fontCard.appendChild(cardHeader);
            fontCard.appendChild(sampleText);

            if (font.url) {
                const cardFooter = document.createElement('div');
                cardFooter.className = 'font-card-footer';

                const sourceLink = document.createElement('a');
                sourceLink.href = font.url;
                sourceLink.target = '_blank';
                sourceLink.rel = 'noopener noreferrer';
                sourceLink.className = 'font-source-link';
                sourceLink.textContent = `View on ${font.source}`;

                const exploreBtn = document.createElement('button');
                exploreBtn.textContent = 'Explore';
                exploreBtn.className = 'explore-btn';
                exploreBtn.addEventListener('click', () => openModal(font));

                cardFooter.appendChild(sourceLink);
                cardFooter.appendChild(exploreBtn);
                fontCard.appendChild(cardFooter);
            }

            fontGrid.appendChild(fontCard);

            // Observe the newly created card for the animation
            if (cardObserver) {
                cardObserver.observe(fontCard);
            }
        });

        // Update pagination controls
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Modal functions
    function openModal(font) {
        modalFontName.textContent = font.family;
        modalFontName.style.fontFamily = `'${font.family}', sans-serif`;
        modalSampleText.style.fontFamily = `'${font.family}', sans-serif`;
        modalFontLink.href = font.url;
        modalFontLink.textContent = `View on ${font.source}`;
        
        // Reset font size
        const initialSize = 48;
        modalSampleText.style.fontSize = `${initialSize}px`;
        fontSizeSlider.value = initialSize;
        fontSizeValue.textContent = `${initialSize}px`;

        modal.classList.add('visible');
    }

    function closeModal() {
        modal.classList.remove('visible');
    }

    fontSizeSlider.addEventListener('input', (e) => {
        const newSize = e.target.value;
        modalSampleText.style.fontSize = `${newSize}px`;
        fontSizeValue.textContent = `${newSize}px`;
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Helper to prepare font family for Google Fonts API URL
    function getFontFamilyForAPI(font) {
        let family = font.family;
        // Use proxy fonts for those not on Google Fonts for this demo
        if (family === 'Acumin Pro') return 'Noto+Sans';
        if (family === 'Brandon Grotesque') return 'Josefin+Sans';
        if (family === 'Clash Display') return 'Anton';
        return family.replace(/ /g, '+');
    }

    searchInput.addEventListener('input', () => {
        currentPage = 1;
        displayFonts();
    });

    globalSampleTextInput.addEventListener('input', () => {
        const newText = globalSampleTextInput.value.trim();
        // Use the default text if the input is empty, otherwise use the new text.
        currentSampleText = newText === '' ? 'The quick brown fox jumps over the lazy dog.' : newText;

        // Update all visible font cards in real-time
        document.querySelectorAll('.font-sample').forEach(p => {
            p.textContent = currentSampleText;
        });
    });

    filterControls.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const btn = e.target;
            const filterGroup = btn.dataset.filterGroup;
            const filterValue = btn.dataset.filterValue;

            // Update active button state
            document.querySelectorAll(`.filter-btn[data-filter-group="${filterGroup}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update filters and display fonts
            currentFilters[filterGroup] = filterValue;
            currentPage = 1;
            displayFonts();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayFonts();
        }
    });

    nextBtn.addEventListener('click', () => {
        const filteredFonts = getFilteredFonts();
        const totalPages = Math.ceil(filteredFonts.length / fontsPerPage) || 1;
        if (currentPage < totalPages) {
            currentPage++;
            displayFonts();
        }
    });

    function scrollToFontDisplay(event) {
        event.preventDefault();
        document.getElementById('font-display-section').scrollIntoView({ behavior: 'smooth' });
    }

    if (exploreBtn) {
        exploreBtn.addEventListener('click', scrollToFontDisplay);
    }
    
    if (navExploreLink) {
        navExploreLink.addEventListener('click', scrollToFontDisplay);
    }

    // Initial display of all fonts
    loadFavorites();
    setupFontCardObserver();
    displayFonts();

    // --- About Section & Learn More ---

    const aboutSection = document.getElementById('about-section');
    const learnMoreBtn = document.querySelector('.learn-more');
    const moreAboutText = document.querySelector('.about-text .more-about-text');

    // Intersection Observer for About Section fade-in
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        observer.observe(aboutSection);
    }

    // "Learn More" button functionality
    if (learnMoreBtn && moreAboutText) {
        const buttonText = learnMoreBtn.querySelector('.button-text');

        learnMoreBtn.addEventListener('click', () => {
            // Toggle the visibility of the extra text
            const isNowVisible = moreAboutText.classList.toggle('show');

            // Update the button text based on the new state
            if (buttonText) {
                buttonText.textContent = isNowVisible ? 'Show Less' : 'Learn More';
            }
        });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (backToTopBtn) {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) { // Show button after scrolling 400px
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
