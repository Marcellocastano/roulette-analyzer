<template>
  <div class="landing-page">
    <div class="language-selector-container">
      <LanguageSelector />
      <ThemeToggle />
      <n-button strong round type="success" size="large" @click="navigateTo('/login')">
        {{ $t('landing.hero.login_button') }}
      </n-button>
    </div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <n-gradient-text
          class="hero-title"
          :gradient="{
            deg: 90,
            from: 'var(--orange-accent)',
            to: '#ffcf00',
          }"
        >
          <h1>Roulette Pro AI</h1>
        </n-gradient-text>
        <h2 class="hero-subtitle">{{ $t('landing.hero.subtitle') }}</h2>
        <p class="hero-description">{{ $t('landing.hero.description') }}</p>
        <div class="cta-buttons">
          <n-button type="primary" size="large" @click="navigateTo('/signup')">
            {{ $t('landing.hero.signup_button') }}
          </n-button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" aria-labelledby="features-heading">
      <h2 id="features-heading" class="section-title">{{ $t('landing.features.title') }}</h2>
      <div class="features-grid">
        <div class="feature-card">
          <n-icon size="48" color="var(--orange-accent)">
            <ChartBar />
          </n-icon>
          <h3>{{ $t('landing.features.statistical_analysis.title') }}</h3>
          <p>{{ $t('landing.features.statistical_analysis.description') }}</p>
        </div>
        <div class="feature-card">
          <n-icon size="48" color="var(--orange-accent)">
            <Brain />
          </n-icon>
          <h3>{{ $t('landing.features.ai_powered.title') }}</h3>
          <p>{{ $t('landing.features.ai_powered.description') }}</p>
        </div>
        <div class="feature-card">
          <n-icon size="48" color="var(--orange-accent)">
            <TrendingUp />
          </n-icon>
          <h3>{{ $t('landing.features.number_prediction.title') }}</h3>
          <p>{{ $t('landing.features.number_prediction.description') }}</p>
        </div>
        <div class="feature-card">
          <n-icon size="48" color="var(--orange-accent)">
            <Wallet />
          </n-icon>
          <h3>{{ $t('landing.features.budget_management.title') }}</h3>
          <p>{{ $t('landing.features.budget_management.description') }}</p>
        </div>
      </div>
    </section>

    <!-- Strategy Section -->
    <section class="strategy" aria-labelledby="strategy-heading">
      <div class="strategy-content">
        <h2 id="strategy-heading" class="section-title white-section">{{ $t('landing.strategy.title') }}</h2>
        <div class="strategy-points">
          <div class="strategy-point">
            <div class="point-number">1</div>
            <div class="point-content">
              <h3>{{ $t('landing.strategy.dozen_analysis.title') }}</h3>
              <p>{{ $t('landing.strategy.dozen_analysis.description') }}</p>
            </div>
          </div>
          <div class="strategy-point">
            <div class="point-number">2</div>
            <div class="point-content">
              <h3>{{ $t('landing.strategy.zero_zone.title') }}</h3>
              <p>{{ $t('landing.strategy.zero_zone.description') }}</p>
            </div>
          </div>
          <div class="strategy-point">
            <div class="point-number">3</div>
            <div class="point-content">
              <h3>{{ $t('landing.strategy.hot_numbers.title') }}</h3>
              <p>{{ $t('landing.strategy.hot_numbers.description') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="strategy-image">
        <img src="/assets/images/software.png" alt="Roulette Table Analysis" />
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section" aria-labelledby="cta-heading">
      <div class="cta-content">
        <h2 id="cta-heading">{{ $t('landing.cta.title') }}</h2>
        <p>{{ $t('landing.cta.description') }}</p>
        <n-button type="primary" size="large" @click="navigateTo('/signup')">
          {{ $t('landing.cta.button') }}
        </n-button>
      </div>
    </section>

    <!-- FAQ Section for SEO -->
    <section class="faq-section" aria-labelledby="faq-heading">
      <h2 id="faq-heading" class="section-title">{{ $t('landing.faq.title') }}</h2>
      <div class="faq-container">
        <div class="faq-item">
          <h3>{{ $t('landing.faq.items[0].question') }}</h3>
          <p>{{ $t('landing.faq.items[0].answer') }}</p>
        </div>
        <div class="faq-item">
          <h3>{{ $t('landing.faq.items[1].question') }}</h3>
          <p>{{ $t('landing.faq.items[1].answer') }}</p>
        </div>
        <div class="faq-item">
          <h3>{{ $t('landing.faq.items[2].question') }}</h3>
          <p>{{ $t('landing.faq.items[2].answer') }}</p>
        </div>
        <div class="faq-item">
          <h3>{{ $t('landing.faq.items[3].question') }}</h3>
          <p>{{ $t('landing.faq.items[3].answer') }}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <h3>Roulette Pro AI</h3>
          <p>{{ $t('landing.footer.tagline') }}</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>{{ $t('landing.footer.navigation') }}</h4>
            <ul>
              <li><a href="#" @click.prevent="navigateTo('/login')">{{ $t('landing.footer.login') }}</a></li>
              <li><a href="#" @click.prevent="navigateTo('/signup')">{{ $t('landing.footer.signup') }}</a></li>
              <li><a href="#" @click.prevent="navigateTo('/pricing')">{{ $t('landing.footer.pricing') }}</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h4>{{ $t('landing.footer.legal') }}</h4>
            <ul>
              <li><a href="#">{{ $t('landing.footer.terms') }}</a></li>
              <li><a href="#">{{ $t('landing.footer.privacy') }}</a></li>
              <li><a href="#">{{ $t('landing.footer.disclaimer') }}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p> {{ new Date().getFullYear() }} Roulette Pro AI. {{ $t('landing.footer.rights') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChartBar, TrendingUp, Wallet } from '@vicons/tabler'
import { BrainCircuit20Regular as Brain } from '@vicons/fluent'
import { useHead } from '@vueuse/head'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle.vue'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

// Configurazione SEO con useHead
useHead({
  title: 'Roulette Pro AI - Il miglior software di analisi per vincere alla roulette',
  meta: [
    { name: 'description', content: 'Roulette Pro AI: software avanzato che analizza statistiche e predice numeri vincenti alla roulette. Aumenta le tue probabilità di vincita con l\'intelligenza artificiale.' },
    { name: 'keywords', content: 'roulette, roulette software, vincere alla roulette, analisi roulette, predizione numeri roulette, strategie roulette, roulette online, sistema roulette, roulette pro' },
    { property: 'og:title', content: 'Roulette Pro AI - Software di analisi per vincere alla roulette' },
    { property: 'og:description', content: 'Aumenta le tue probabilità di vincita alla roulette con analisi statistiche avanzate e predizioni basate su AI.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://roulettepro.ai' },
    { property: 'og:image', content: '/assets/images/roulette-og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Roulette Pro AI - Software di analisi per vincere alla roulette' },
    { name: 'twitter:description', content: 'Aumenta le tue probabilità di vincita alla roulette con analisi statistiche avanzate e predizioni basate su AI.' },
    { name: 'twitter:image', content: '/assets/images/roulette-og-image.jpg' }
  ],
  link: [
    { rel: 'canonical', href: 'https://roulettepro.ai' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Roulette Pro AI',
        'applicationCategory': 'UtilityApplication',
        'operatingSystem': 'Web',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'EUR'
        },
        'description': 'Software avanzato che analizza statistiche e predice numeri vincenti alla roulette. Aumenta le tue probabilità di vincita con l\'intelligenza artificiale.',
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '156'
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Roulette Pro AI - Il miglior software di analisi per vincere alla roulette',
        'description': 'Roulette Pro AI: software avanzato che analizza statistiche e predice numeri vincenti alla roulette. Aumenta le tue probabilità di vincita con l\'intelligenza artificiale.',
        'publisher': {
          '@type': 'Organization',
          'name': 'Roulette Pro AI',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://roulettepro.ai/assets/images/logo.png'
          }
        },
        'mainEntity': {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'Come funziona il sistema di predizione della roulette?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Il nostro sistema analizza migliaia di dati statistici per identificare pattern e squilibri nel gioco della roulette. Monitoriamo le dozzine \'sofferenti\', la zona dello zero, i numeri caldi e freddi, e utilizziamo algoritmi avanzati per prevedere quali numeri hanno maggiori probabilità di uscire.'
              }
            },
            {
              '@type': 'Question',
              'name': 'È possibile vincere alla roulette con un sistema?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Sebbene la roulette sia un gioco di probabilità, un\'analisi statistica avanzata può aiutare a identificare squilibri temporanei e pattern che possono essere sfruttati. Il nostro software non garantisce vincite, ma aumenta significativamente le probabilità di successo attraverso un approccio scientifico e metodico.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Quali sono le strategie più efficaci per la roulette?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Le strategie più efficaci includono l\'analisi delle dozzine sofferenti, il monitoraggio della zona zero, l\'identificazione dei numeri caldi, e una gestione disciplinata del budget. Il nostro software integra tutte queste strategie in un unico strumento facile da usare.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Il software funziona sia per la roulette online che per quella fisica?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Sì, Roulette Pro AI è progettato per funzionare con entrambe le versioni. Puoi inserire manualmente i numeri usciti in un casinò fisico o utilizzare le nostre funzionalità di importazione dati per la roulette online.'
              }
            }
          ]
        }
      })
    }
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap');

.landing-page {
  width: 100%;
  overflow-x: hidden;
  font-family: 'Montserrat', sans-serif;
  color: var(--card-text);
  position: relative;
}

.language-selector-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  gap: 10px;
  background: var(--navbar-bg);
  padding: 10px;
  border-radius: 20px;
}

/* Hero Section */
.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/assets/images/rl-bg1.jpg');
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  margin-bottom: 20px;
}

.hero-title h1 {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 4rem;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--gray-light);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 40px;
  color: var(--gray-light);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.roulette-animation {
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 300px;
  height: 300px;
  z-index: 1;
  opacity: 0.6;
}

.roulette-animation svg {
  width: 100%;
  height: 100%;
}

.table {
  stroke: #ffcf00;
  animation: draw 4s ease-in-out infinite alternate;
}

.ball {
  fill: #fff;
  animation: moveBall 8s ease-in-out infinite;
}

.gold {
  fill: var(--accent-gold);
}

@keyframes draw {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes moveBall {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, 5px);
  }
  50% {
    transform: translate(-5px, -10px);
  }
  75% {
    transform: translate(-10px, 5px);
  }
  100% {
    transform: translate(0, 0);
  }
}

/* Features Section */
.features {
  padding: 80px 20px;
  background-color: var(--body-background);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 60px;
  color: var(--gold-accent);
}

.white-section {
  color: var(--card-text);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: var(--auth-card-background);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin: 20px 0 15px;
  color: var(--card-text);
}

.feature-card p {
  color: var(--card-text);
  line-height: 1.6;
}

/* Strategy Section */
.strategy {
  display: flex;
  flex-wrap: wrap;
  padding: 80px 40px;
  background-color: var(--navbar-bg);
  position: relative;
}

.strategy-content {
  flex: 1;
  min-width: 300px;
  padding-right: 40px;
}

.strategy-image {
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.strategy-image img {
  max-width: 100%;
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.strategy-points {
  margin-top: 40px;
}

.strategy-point {
  display: flex;
  margin-bottom: 30px;
}

.point-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(90deg, var(--orange-accent), #ffcf00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-right: 20px;
  flex-shrink: 0;
}

.point-content h3 {
  font-size: 1.3rem;
  margin: 0 0 10px;
  color: var(--card-text);
}

.point-content p {
  color: var(--card-text);
  line-height: 1.6;
}

/* Testimonials Section */
.testimonials {
  padding: 80px 20px;
  background-color: var(--body-background);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background-color: var(--auth-card-background);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.testimonial-content {
  font-style: italic;
  margin-bottom: 20px;
  color: var(--card-text);
  line-height: 1.8;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
}

.testimonial-author strong {
  color: var(--card-text);
}

.testimonial-author span {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

/* CTA Section */
.cta-section {
  padding: 100px 20px;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/images/casino-bg.jpg');
  background-size: cover;
  background-position: center;
  text-align: center;
  position: relative;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cta-section h2 {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 20px;
}

.cta-section p {
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 40px;
  line-height: 1.6;
}

/* FAQ Section */
.faq-section {
  padding: 80px 20px;
  background-color: var(--background-color);
}

.faq-container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.faq-item {
  background-color: var(--card-background);
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.faq-item h3 {
  color: var(--orange-accent);
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: 600;
}

.faq-item p {
  color: var(--card-text);
  line-height: 1.6;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .faq-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Aggiunta di stili per migliorare l'accessibilità e la SEO */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Miglioramento del contrasto per l'accessibilità */
.hero-subtitle, .hero-description {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* Miglioramento della leggibilità */
.testimonial-content p {
  font-style: italic;
  line-height: 1.8;
}

/* Footer */
.landing-footer {
  background-color: var(--navbar-bg);
  padding: 60px 20px 20px;
  color: var(--card-text);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 40px;
}

.footer-logo {
  flex: 1;
  min-width: 200px;
  margin-bottom: 30px;
}

.footer-logo h3 {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  margin: 0 0 15px;
  background: linear-gradient(90deg, var(--orange-accent), #ffcf00);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.link-group {
  min-width: 150px;
}

.link-group h4 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: var(--card-text);
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-group li {
  margin-bottom: 10px;
}

.link-group a {
  color: var(--secondary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: var(--orange-accent);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-bottom p {
  color: var(--secondary-color);
  font-size: 0.9rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-title h1 {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .strategy {
    flex-direction: column;
  }
  
  .strategy-content {
    padding-right: 0;
    margin-bottom: 40px;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 15px;
  }
  
  .footer-content {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-title h1 {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>