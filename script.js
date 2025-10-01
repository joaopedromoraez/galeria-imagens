// Script para Galeria de Imagens

class ImageGallery {
  constructor() {
    this.galleryContainer = document.getElementById('gallery-container');
    this.addButton = document.getElementById('add-image-btn');
    this.imageCounter = 0;

    this.init();
  }

  init() {
    // Adicionar event listener para o botão
    this.addButton.addEventListener('click', () => this.addSimulatedImage());

    // Adicionar suporte para teclado (Enter e Space)
    this.addButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.addSimulatedImage();
      }
    });

    console.log('Galeria de Imagens inicializada');
  }

  addSimulatedImage() {
    this.imageCounter++;

    // Criar elemento da imagem
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    // Criar placeholder da imagem
    const placeholderImage = document.createElement('div');
    placeholderImage.className = 'placeholder-image';

    // Criar informações da imagem
    const imageInfo = document.createElement('div');
    imageInfo.className = 'image-info';

    const imageTitle = document.createElement('div');
    imageTitle.className = 'image-title';
    imageTitle.textContent = `Imagem Simulada ${this.imageCounter}`;

    const imageDate = document.createElement('div');
    imageDate.className = 'image-date';
    imageDate.textContent = this.getCurrentDate();

    // Montar estrutura
    imageInfo.appendChild(imageTitle);
    imageInfo.appendChild(imageDate);
    galleryItem.appendChild(placeholderImage);
    galleryItem.appendChild(imageInfo);

    // Adicionar à galeria
    this.galleryContainer.appendChild(galleryItem);

    // Feedback visual no botão
    this.showButtonFeedback();

    // Log para debug
    console.log(`Imagem simulada ${this.imageCounter} adicionada à galeria`);
  }

  getCurrentDate() {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return now.toLocaleDateString('pt-BR', options);
  }

  showButtonFeedback() {
    // Adicionar classe de feedback
    this.addButton.style.transform = 'scale(0.95)';
    this.addButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

    // Temporariamente alterar o texto
    const originalText = this.addButton.querySelector('.btn-text').textContent;
    this.addButton.querySelector('.btn-text').textContent = 'Adicionada!';

    // Restaurar após 1 segundo
    setTimeout(() => {
      this.addButton.style.transform = '';
      this.addButton.style.background = '';
      this.addButton.querySelector('.btn-text').textContent = originalText;
    }, 1000);
  }
}

// Inicializar a galeria quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new ImageGallery();
});
