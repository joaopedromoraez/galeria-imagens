// Script para Galeria de Imagens

/**
 * Classe responsável por gerenciar a galeria de imagens
 * Implementação agnóstica que pode ser facilmente integrada com APIs
 */
class GalleryManager {
  constructor(options = {}) {
    this.galleryContainer = document.getElementById(
      options.galleryContainerId || "gallery-container"
    );
    this.filterContainer = document.getElementById(
      options.filterContainerId || "filter-buttons"
    );
    this.noResultsElement = document.getElementById(
      options.noResultsId || "no-results"
    );

    this.images = [];
    this.categories = [];
    this.currentFilter = "all";

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
    const categoriesSet = new Set(images.map((img) => img.category));
    return Array.from(categoriesSet).sort();
  }

  /**
   * Renderiza os botões de filtro
   */
  renderFilters() {
    if (!this.filterContainer) return;

    const allButton = this.createFilterButton("all", "Todas", true);
    this.filterContainer.innerHTML = "";
    this.filterContainer.appendChild(allButton);

    this.categories.forEach((category) => {
      const button = this.createFilterButton(
        category,
        this.capitalizeFirst(category)
      );
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
    const button = document.createElement("button");
    button.className = `filter-btn ${isActive ? "active" : ""}`;
    button.textContent = label;
    button.dataset.filter = value;

    button.addEventListener("click", () =>
      this.handleFilterClick(value, button)
    );

    return button;
  }

  /**
   * Manipula o clique no filtro
   * @param {string} filterValue - Valor do filtro selecionado
   * @param {HTMLElement} button - Botão clicado
   */
  handleFilterClick(filterValue, button) {
    // Remove classe active de todos os botões
    this.filterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Adiciona classe active ao botão clicado
    button.classList.add("active");

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
    if (this.currentFilter === "all") {
      return this.images;
    }
    return this.images.filter((img) => img.category === this.currentFilter);
  }

  /**
   * Renderiza a galeria de imagens
   */
  renderGallery() {
    if (!this.galleryContainer) return;

    const filteredImages = this.getFilteredImages();

    // Mostra/esconde mensagem de sem resultados
    if (filteredImages.length === 0) {
      this.galleryContainer.classList.add("hidden");
      this.noResultsElement?.classList.remove("hidden");
      return;
    }

    this.galleryContainer.classList.remove("hidden");
    this.noResultsElement?.classList.add("hidden");

    // Limpa o container
    this.galleryContainer.innerHTML = "";

    // Renderiza cada imagem
    filteredImages.forEach((image) => {
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
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.dataset.id = image.id;
    item.title = `${image.title} - ${
      image.description || "Clique para ver mais detalhes"
    }`;

    const img = document.createElement("img");
    img.src = image.url;
    img.alt = image.title;
    img.title = image.description || image.title;
    img.loading = "lazy";

    // Criar container da legenda
    const caption = document.createElement("div");
    caption.className = "gallery-item-caption";

    // Título
    const title = document.createElement("h3");
    title.className = "gallery-item-title";
    title.textContent = image.title;
    title.title = image.title;

    // Descrição (se existir)
    if (image.description) {
      const description = document.createElement("p");
      description.className = "gallery-item-description";
      description.textContent = image.description;
      description.title = image.description;
      caption.appendChild(description);
    }

    // Categoria
    const category = document.createElement("span");
    category.className = "gallery-item-category";
    category.textContent = this.capitalizeFirst(image.category);
    category.title = `Categoria: ${this.capitalizeFirst(image.category)}`;

    // Montar a legenda
    caption.appendChild(title);
    caption.appendChild(category);

    // Add click event to open lightbox
    item.addEventListener("click", () => {
      openLightbox(image.url, image.title, image.description, image.category);
    });

    item.appendChild(img);
    item.appendChild(caption);

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
      filteredImages: this.getFilteredImages(),
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
    title: "Paisagem Montanhosa",
    description:
      "Uma vista deslumbrante das montanhas cobertas de neve, capturada durante o nascer do sol. As cores douradas refletem na paisagem criando um ambiente mágico e sereno.",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    category: "natureza",
  },
  {
    id: 2,
    title: "Arquitetura Moderna",
    description:
      "Edifício contemporâneo com design minimalista e linhas limpas. A arquitetura moderna combina funcionalidade com estética, criando espaços únicos e inspiradores.",
    url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=400&h=300&fit=crop",
    category: "arquitetura",
  },
  {
    id: 3,
    title: "Gato Fofo",
    description:
      "Um adorável gatinho com olhos expressivos e pelagem macia. Os felinos são conhecidos por sua independência e carinho, sendo companheiros perfeitos para muitas pessoas.",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
    category: "animais",
  },
  {
    id: 4,
    title: "Praia Paradisíaca",
    description:
      "Cristalinas águas azuis e areia branca formam este paraíso tropical. O som das ondas e a brisa marinha criam o ambiente perfeito para relaxamento e contemplação.",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    category: "natureza",
  },
  {
    id: 5,
    title: "Cidade à Noite",
    description:
      "O horizonte urbano iluminado por milhares de luzes que criam um espetáculo visual único. A vida noturna da cidade pulsa com energia e possibilidades infinitas.",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop",
    category: "urbano",
  },
  {
    id: 6,
    title: "Cachorro Brincando",
    description:
      "Um cão alegre e energético aproveitando o momento de diversão. Os cães são conhecidos por sua lealdade e capacidade de trazer alegria para nossas vidas.",
    url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
    category: "animais",
  },
  {
    id: 7,
    title: "Ponte Arquitetônica",
    description:
      "Uma impressionante ponte que combina engenharia e arte. As pontes conectam não apenas lugares, mas também pessoas e culturas através de suas estruturas majestosas.",
    url: "https://images.unsplash.com/photo-1496564203457-11bb12075d90?w=400&h=300&fit=crop",
    category: "arquitetura",
  },
  {
    id: 8,
    title: "Floresta Verde",
    description:
      "Uma densa floresta com árvores altas e vegetação exuberante. Os ecossistemas florestais são essenciais para o equilíbrio do planeta e abrigam inúmeras espécies.",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
    category: "natureza",
  },
  {
    id: 9,
    title: "Ruas de Cidade",
    description:
      "As ruas movimentadas da cidade onde a vida urbana acontece. Cada esquina conta uma história e cada pessoa carrega seus sonhos e aspirações.",
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop",
    category: "urbano",
  },
  {
    id: 10,
    title: "Pássaro Colorido",
    description:
      "Um pássaro exótico com plumagem vibrante e cores impressionantes. As aves são símbolos de liberdade e beleza, enriquecendo nossos céus com sua presença.",
    url: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop",
    category: "animais",
  },
  {
    id: 11,
    title: "Edifício Histórico",
    description:
      "Uma construção centenária que preserva a história e cultura de uma época. Os edifícios históricos são testemunhas do passado e inspiração para o futuro.",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
    category: "arquitetura",
  },
  {
    id: 12,
    title: "Pôr do Sol",
    description:
      "O espetáculo diário do pôr do sol, onde o céu se transforma em uma paleta de cores douradas e alaranjadas. Um momento de contemplação e gratidão pela beleza da natureza.",
    url: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400&h=300&fit=crop",
    category: "natureza",
  },
];

// ============================================
// Inicialização
// ============================================

// Cria instância da galeria com callbacks opcionais
const gallery = new GalleryManager({
  galleryContainerId: "gallery-container",
  filterContainerId: "filter-buttons",
  noResultsId: "no-results",

  // Callback quando o filtro muda - útil para analytics ou API calls
  onFilterChange: (filterValue) => {
    console.log("Filtro alterado para:", filterValue);
    // Aqui você pode fazer uma chamada de API, por exemplo
    // fetchImagesByCategory(filterValue);
  },

  // Callback quando uma imagem é clicada
  onImageClick: (image) => {
    console.log("Imagem clicada:", image);
  },
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

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

/**
 * Opens the lightbox with the specified image
 * @param {string} imageSrc - Source URL of the image
 * @param {string} imageTitle - Title of the image
 * @param {string} imageDescription - Description of the image
 * @param {string} imageCategory - Category of the image
 */
function openLightbox(
  imageSrc,
  imageTitle,
  imageDescription = "",
  imageCategory = ""
) {
  lightbox.classList.add("active");
  lightboxImg.src = imageSrc;

  // Criar HTML estruturado para a legenda
  let captionHTML = `<div class="lightbox-title">${imageTitle}</div>`;

  if (imageDescription) {
    captionHTML += `<div class="lightbox-description">${imageDescription}</div>`;
  }

  if (imageCategory) {
    captionHTML += `<div class="lightbox-category">${
      imageCategory.charAt(0).toUpperCase() + imageCategory.slice(1)
    }</div>`;
  }

  lightboxCaption.innerHTML = captionHTML;
  document.body.style.overflow = "hidden"; // Prevent scrolling
}

/**
 * Closes the lightbox
 */
function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
}

// Close lightbox when clicking the X button
lightboxClose.addEventListener("click", closeLightbox);

// Close lightbox when clicking outside the image
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Close lightbox with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});
