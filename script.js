// Script para Galeria de Imagens

/**
 * Classe responsável por gerenciar a galeria de imagens
 * Implementação agnóstica que pode ser facilmente integrada com APIs
 */
class GalleryManager {
    constructor(options = {}) {
        this.galleryContainer = document.getElementById(options.galleryContainerId || 'gallery-container');
        this.filterContainer = document.getElementById(options.filterContainerId || 'filter-buttons');
        this.noResultsElement = document.getElementById(options.noResultsId || 'no-results');
        
        this.images = [];
        this.categories = [];
        this.currentFilter = 'all';
        
        // Callbacks para facilitar integração futura
        this.onFilterChange = options.onFilterChange || null;
        this.onImageClick = options.onImageClick || null;
    }

    /**
     * Inicializa a galeria com dados
     * @param {Array} images - Array de objetos de imagem
     */
    init(images) {
        this.images = images;
        this.categories = this.extractCategories(images);
        this.renderFilters();
        this.renderGallery();
    }

    /**
     * Extrai categorias únicas das imagens
     * @param {Array} images - Array de imagens
     * @returns {Array} - Array de categorias únicas
     */
    extractCategories(images) {
        const categoriesSet = new Set(images.map(img => img.category));
        return Array.from(categoriesSet).sort();
    }

    /**
     * Renderiza os botões de filtro
     */
    renderFilters() {
        if (!this.filterContainer) return;

        const allButton = this.createFilterButton('all', 'Todas', true);
        this.filterContainer.innerHTML = '';
        this.filterContainer.appendChild(allButton);

        this.categories.forEach(category => {
            const button = this.createFilterButton(category, this.capitalizeFirst(category));
            this.filterContainer.appendChild(button);
        });
    }

    /**
     * Cria um botão de filtro
     * @param {string} value - Valor do filtro
     * @param {string} label - Texto do botão
     * @param {boolean} isActive - Se o botão está ativo
     * @returns {HTMLElement} - Elemento do botão
     */
    createFilterButton(value, label, isActive = false) {
        const button = document.createElement('button');
        button.className = `filter-btn ${isActive ? 'active' : ''}`;
        button.textContent = label;
        button.dataset.filter = value;
        
        button.addEventListener('click', () => this.handleFilterClick(value, button));
        
        return button;
    }

    /**
     * Manipula o clique no filtro
     * @param {string} filterValue - Valor do filtro selecionado
     * @param {HTMLElement} button - Botão clicado
     */
    handleFilterClick(filterValue, button) {
        // Remove classe active de todos os botões
        this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Adiciona classe active ao botão clicado
        button.classList.add('active');
        
        // Atualiza o filtro atual
        this.currentFilter = filterValue;
        
        // Callback para integração futura
        if (this.onFilterChange) {
            this.onFilterChange(filterValue);
        }
        
        // Renderiza a galeria filtrada
        this.renderGallery();
    }

    /**
     * Filtra as imagens baseado no filtro atual
     * @returns {Array} - Array de imagens filtradas
     */
    getFilteredImages() {
        if (this.currentFilter === 'all') {
            return this.images;
        }
        return this.images.filter(img => img.category === this.currentFilter);
    }

    /**
     * Renderiza a galeria de imagens
     */
    renderGallery() {
        if (!this.galleryContainer) return;

        const filteredImages = this.getFilteredImages();
        
        // Mostra/esconde mensagem de sem resultados
        if (filteredImages.length === 0) {
            this.galleryContainer.classList.add('hidden');
            this.noResultsElement?.classList.remove('hidden');
            return;
        }
        
        this.galleryContainer.classList.remove('hidden');
        this.noResultsElement?.classList.add('hidden');
        
        // Limpa o container
        this.galleryContainer.innerHTML = '';
        
        // Renderiza cada imagem
        filteredImages.forEach(image => {
            const item = this.createGalleryItem(image);
            this.galleryContainer.appendChild(item);
        });
    }

    /**
     * Cria um item da galeria
     * @param {Object} image - Objeto da imagem
     * @returns {HTMLElement} - Elemento do item
     */
    createGalleryItem(image) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.id = image.id;

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.loading = 'lazy';

        // Add click event to open lightbox
        item.addEventListener('click', () => {
            openLightbox(image.url, image.title);
        });

        item.appendChild(img);

        return item;
    }

    /**
     * Atualiza as imagens da galeria
     * Útil para integração com API
     * @param {Array} newImages - Novo array de imagens
     */
    updateImages(newImages) {
        this.images = newImages;
        this.categories = this.extractCategories(newImages);
        this.renderFilters();
        this.renderGallery();
    }

    /**
     * Capitaliza a primeira letra de uma string
     * @param {string} str - String a ser capitalizada
     * @returns {string} - String capitalizada
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Retorna o estado atual da galeria
     * @returns {Object} - Estado atual
     */
    getState() {
        return {
            images: this.images,
            categories: this.categories,
            currentFilter: this.currentFilter,
            filteredImages: this.getFilteredImages()
        };
    }
}

// ============================================
// Dados mock para demonstração
// Substitua por uma chamada de API real
// ============================================

const mockImages = [
    {
        id: 1,
        title: 'Paisagem Montanhosa',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        category: 'natureza'
    },
    {
        id: 2,
        title: 'Arquitetura Moderna',
        url: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400&h=300&fit=crop',
        category: 'arquitetura'
    },
    {
        id: 3,
        title: 'Gato Fofo',
        url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
        category: 'animais'
    },
    {
        id: 4,
        title: 'Praia Paradisíaca',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
        category: 'natureza'
    },
    {
        id: 5,
        title: 'Cidade à Noite',
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop',
        category: 'urbano'
    },
    {
        id: 6,
        title: 'Cachorro Brincando',
        url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
        category: 'animais'
    },
    {
        id: 7,
        title: 'Ponte Arquitetônica',
        url: 'https://images.unsplash.com/photo-1496564203457-11bb12075d90?w=400&h=300&fit=crop',
        category: 'arquitetura'
    },
    {
        id: 8,
        title: 'Floresta Verde',
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
        category: 'natureza'
    },
    {
        id: 9,
        title: 'Ruas de Cidade',
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop',
        category: 'urbano'
    },
    {
        id: 10,
        title: 'Pássaro Colorido',
        url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop',
        category: 'animais'
    },
    {
        id: 11,
        title: 'Edifício Histórico',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
        category: 'arquitetura'
    },
    {
        id: 12,
        title: 'Pôr do Sol',
        url: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400&h=300&fit=crop',
        category: 'natureza'
    }
];

// ============================================
// Inicialização
// ============================================

// Cria instância da galeria com callbacks opcionais
const gallery = new GalleryManager({
    galleryContainerId: 'gallery-container',
    filterContainerId: 'filter-buttons',
    noResultsId: 'no-results',
    
    // Callback quando o filtro muda - útil para analytics ou API calls
    onFilterChange: (filterValue) => {
        console.log('Filtro alterado para:', filterValue);
        // Aqui você pode fazer uma chamada de API, por exemplo
        // fetchImagesByCategory(filterValue);
    },
    
    // Callback quando uma imagem é clicada
    onImageClick: (image) => {
        console.log('Imagem clicada:', image);
    }
});

// Inicializa a galeria com dados mock
// Para integração com API, substitua por:
// fetch('/api/images')
//     .then(res => res.json())
//     .then(data => gallery.init(data))
//     .catch(err => console.error('Erro ao carregar imagens:', err));

gallery.init(mockImages);

// ============================================
// Exemplo de integração com API
// ============================================

// Atualizar imagens de uma API
// fetch('/api/images')
//     .then(res => res.json())
//     .then(data => gallery.updateImages(data))
//     .catch(err => console.error('Erro:', err));

// ============================================
// Lightbox functionality
// ============================================

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

/**
 * Opens the lightbox with the specified image
 * @param {string} imageSrc - Source URL of the image
 * @param {string} imageTitle - Title/caption of the image
 */
function openLightbox(imageSrc, imageTitle) {
    lightbox.classList.add('active');
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = imageTitle;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Closes the lightbox
 */
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close lightbox when clicking the X button
lightboxClose.addEventListener('click', closeLightbox);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

