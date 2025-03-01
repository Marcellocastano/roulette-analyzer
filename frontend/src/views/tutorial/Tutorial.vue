<template>
  <div class="tutorial-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <n-h1 class="hero-title">Come Usare il Software</n-h1>
        <n-p class="hero-description">
          Ricorda che questo non è un generatore di numeri magici, ma uno strumento che grazie allo
          studio delle statistiche ti permette di giocare con un metodo testato e consolidato.
        </n-p>
      </div>
    </section>

    <!-- Two Column Cards -->
    <div class="text-center mb-6">
      <n-h2 class="mb-0">Concetti Base</n-h2>
      <n-p class="mb-0 fontSizeHuge"
        >A grandi linee il concetto fondamentale su cui si basa la strategia è una serie di fattori
        messi insieme, tra cui:</n-p
      >
    </div>
    <section class="three-column-section">
      <n-card class="feature-card">
        <n-h3>Legge dei grandi numeri</n-h3>
        <n-p
          >Nel contesto della roulette, questo significa che, su un numero molto alto di spin,
          <strong
            >le probabilità di uscita dei vari numeri e delle diverse zone del tavolo
            <u>tenderanno ad equilibrarsi</u></strong
          >. Questo ovviamente non significa andare a constatare la dozzina "in difetto" e puntare
          su quei numeri. È importante sottolineare che la legge dei grandi numeri si applica solo
          su un numero elevato di osservazioni. Pertanto, la strategia non garantisce la vincita, ma
          aumenta le probabilità di successo se applicata correttamente e con una
          <strong>gestione oculata del budget</strong></n-p
        >
      </n-card>
      <n-card class="feature-card">
        <n-h3>Zona Zero</n-h3>
        <n-p
          >La strategia è sviluppata per funzionare al meglio sfruttando la zona ZERO della
          roulette, cioè quei numeri che vanno da 12 al 15. Se la percentuale di uscita della zona
          zero è <strong>inferiore alla media (20%)</strong> sia a 50 che a 500 spin, si considera
          che la zona sia "<strong>in difetto</strong>". Questo suggerisce che la zona è in ritardo
          e che potrebbe essere il momento di puntare sui suoi numeri. Il ritardo nella zona zero
          indica che i numeri in quella zona non stanno uscendo con la frequenza attesa, creando uno
          squilibrio rispetto alla legge dei grandi numeri</n-p
        >
      </n-card>
      <n-card class="feature-card">
        <n-h3>Crescita dei numeri</n-h3>
        <n-p
          >Si confrontano le statistiche a 50 spin con quelle a 500 spin per individuare i numeri
          che mostrano una <strong>tendenza positiva</strong>. I numeri in crescita sono quelli che
          a 50 spin, mostrano un <strong>aumento della frequenza di uscita</strong> se si considera
          un periodo più ampio, fino a 500 spin. Questi numeri sono considerati promettenti perchè
          il loro aumento suggerisce che stanno iniziando a "recuperare" il ritardo e che potrebbero
          diventare più frequenti nei prossimi spin</n-p
        >
      </n-card>
    </section>

    <div class="text-center mb-6">
      <n-h2 class="mb-0">Inserimento delle statistiche</n-h2>
    </div>
    <section class="steps-section">
      <div class="two-column-section">
        <div class="column">
          <img src="/assets/images/statistics/dozens.png" alt="Dozens statistics" />
          <n-p
            >Le input riguardanti le dozzine vanno popolate inserendo le percentuali presenti nelle
            statistiche del tavolo. Invece per quanto riguarda l'input Zona ZERO % va presa la
            percentuale della sezione "ZERO" e non quella dove c'è il numero 0. Sia a 50 che a 500
            spin. Nell'immagin di esempio le statistiche sono a 50 spin, per visualizzare le
            statistiche a 500 spin basta fare lo slide verso destra.</n-p
          >
          <img src="/assets/images/statistics/dozens-statistics-50.png" alt="Dozens statistics" />
        </div>
        <div class="column">
          <img src="/assets/images/statistics/wheel-statistics.png" alt="Wheel statistics" />
          <n-p
            >La mezza ruota tenta di replicare la ruota delle statistiche del tavolo da gioco. In
            questa fase bisogna regolare il riempimento dei coni in modo che risultino simili a
            quelle del tavolo. Le due immagini spiegano la pratica su come regolare il riempimento
            dei coni. Anche in questo caso facendo lo slide verso destra, si va ai 500 spin e si
            procede nuovamente alle regolazione dei coni tentando di replicare il più fedelmente
            possibile le statistiche del tavolo.</n-p
          >
          <img src="/assets/images/statistics/increase-numbers-50.png" alt="Wheel statistics" />
        </div>
      </div>
    </section>
    <!-- Two Column Section -->
    <section class="two-column-section">
      <div class="column">
        <n-h2>Statistiche</n-h2>
        <n-p
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.</n-p
        >
      </div>
      <div class="column">
        <n-h2>Andamento dei numeri</n-h2>
        <n-p
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.</n-p
        >
      </div>
    </section>

    <!-- Full Width Key Concept -->
    <section class="key-concept-section">
      <n-card class="concept-card">
        <n-h2>Consigli di gioco e osservazioni</n-h2>
        <n-p> </n-p>
      </n-card>
    </section>

    <!-- Image and Content Section -->
    <section class="image-content-section">
      <div class="image-container">
        <n-image src="placeholder.jpg" object-fit="cover" />
      </div>
      <div class="content">
        <n-h2>Strategia di Base</n-h2>
        <n-p
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.</n-p
        >
      </div>
    </section>

    <!-- Full Width Steps -->
    <section class="steps-section">
      <n-steps vertical>
        <n-step title="Passo 1" description="Lorem ipsum dolor sit amet" />
        <n-step title="Passo 2" description="Consectetur adipiscing elit" />
        <n-step title="Passo 3" description="Sed do eiusmod tempor" />
      </n-steps>
    </section>

    <!-- Image and Content Reversed -->
    <section class="image-content-section reverse">
      <div class="content">
        <n-h2>Analisi Avanzata</n-h2>
        <n-p
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.</n-p
        >
      </div>
      <div class="image-container">
        <n-image src="placeholder.jpg" object-fit="cover" />
      </div>
    </section>

    <!-- Final Call to Action -->
    <section class="cta-section">
      <n-card class="cta-card">
        <n-h2>Pronto per Iniziare?</n-h2>
        <n-p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</n-p>
        <n-button type="primary" size="large">Inizia Ora</n-button>
      </n-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NSteps, NStep, NImage } from 'naive-ui'
</script>

<style lang="scss" scoped>
.tutorial-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  p {
    font-size: 1rem;
  }

  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
}

// Hero Section
.hero-section {
  text-align: center;
  margin-bottom: 4rem;

  .hero-title {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  .hero-description {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto;
    color: var(--text-color-light);
  }
}

// Two Column Layout
.two-column-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
.three-column-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
// Key Concept Section
.key-concept-section {
  margin-bottom: 4rem;

  .concept-card {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
  }
}

// Image and Content Section
.image-content-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
  margin-bottom: 4rem;
  align-items: center;

  &.reverse {
    direction: rtl;
    .content {
      direction: ltr;
    }
    .image-container {
      direction: ltr;
    }
  }

  .image-container {
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }

  .content {
    h2 {
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;

    &.reverse {
      direction: ltr;
    }
  }
}

// Feature Cards
.feature-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  transition: transform 0.3s ease;
  border-radius: 20px;
  border-color: var(--accent-color);

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.5rem;
    text-align: center;
  }
}

// Steps Section
.steps-section {
  margin-bottom: 4rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
}

// CTA Section
.cta-section {
  text-align: center;
  margin-bottom: 4rem;

  .cta-card {
    padding: 3rem;
    background: linear-gradient(45deg, var(--primary-color-dark), var(--secondary-color-dark));

    h2 {
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 2rem;
    }
  }
}
</style>
