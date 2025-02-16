<template>
  <div class="tutorial-container">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="creative-title">Come usare il software</h1>
        <p class="hero-description">
          Il nostro software di analisi statistica ti permette di analizzare i pattern della roulette
          e identificare le migliori opportunità di gioco, basandosi su dati storici e analisi in tempo reale.
        </p>
      </div>
    </section>
    <glass-card title="Il mio titolo" image-position="right" @action="handleAction">
      <template #content>
        <p>Questo è il contenuto della card...</p>
      </template>
      
    </glass-card>

    <section class="services-section">
      <h2 class="section-title">COSA <span class="highlight">FACCIAMO</span>?</h2>
      <p class="section-description">
        Forniamo strumenti avanzati per l'analisi statistica del gioco della roulette,
        permettendoti di prendere decisioni informate basate sui dati.
      </p>

      <div class="services-grid">
        <div class="service-card">
          <n-icon size="48" class="service-icon">
            <ChartLineUpIcon />
          </n-icon>
          <h3>Analisi Statistica</h3>
          <p>Monitoriamo le tendenze delle dozzine e delle zone per identificare opportunità di gioco.</p>
        </div>

        <div class="service-card">
          <n-icon size="48" class="service-icon">
            <DatabaseIcon />
          </n-icon>
          <h3>Gestione Dati</h3>
          <p>Tracciamo e analizziamo i dati storici per prevedere tendenze future.</p>
        </div>

        <div class="service-card">
          <n-icon size="48" class="service-icon">
            <ChartBarIcon />
          </n-icon>
          <h3>Monitoraggio Real-time</h3>
          <p>Visualizza statistiche in tempo reale e ricevi suggerimenti immediati.</p>
        </div>

        <div class="service-card">
          <n-icon size="48" class="service-icon">
            <BrainIcon />
          </n-icon>
          <h3>Strategia Intelligente</h3>
          <p>Suggerimenti basati su algoritmi avanzati e analisi dei pattern.</p>
        </div>
      </div>
    </section>

    <section class="about-section">
      <h2 class="section-title">CHI <span class="highlight">SIAMO</span>?</h2>
      <div class="about-content">
        <div class="about-image">
          <n-image
            src="/images/about-image.jpg"
            :preview-disabled="true"
            object-fit="cover"
            class="glow-effect"
          />
        </div>
        <div class="about-features">
          <div class="feature">
            <n-icon size="32" class="feature-icon">
              <CodeIcon />
            </n-icon>
            <div class="feature-content">
              <h3>Codice Pulito</h3>
              <p>Software ottimizzato per prestazioni eccellenti</p>
            </div>
          </div>
          <div class="feature">
            <n-icon size="32" class="feature-icon">
              <BrushIcon />
            </n-icon>
            <div class="feature-content">
              <h3>Design Moderno</h3>
              <p>Interfaccia intuitiva e piacevole da utilizzare</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <n-card>
      <n-text>
        La strategia si basa sulla legge dei grandi numeri: nel lungo periodo, i valori percentuali delle dozzine e delle zone della roulette tendono ad allinearsi a una media. Lo scostamento da questa media rappresenta un'opportunità di puntata.
      </n-text>
      <div class="tutorial-concept">
        <n-alert type="info" title="Concetto Chiave">
          Una "dozzina sofferente" o "zona in sofferenza" è un'area di gioco con percentuali inferiori alla soglia attesa, che ha più probabilità di vedere i suoi numeri uscire nel breve periodo.
        </n-alert>
      </div>
    </n-card>

    <n-card>
      <n-space vertical>
        <n-text>
          Il monitoraggio avviene su due livelli temporali:
        </n-text>
        <n-list>
          <n-list-item>
            <n-tag type="success" round>500 spin</n-tag>
            <span style="margin-left: 8px">Trend di lungo periodo (soglia di sofferenza: 27-28%)</span>
          </n-list-item>
          <n-list-item>
            <n-tag type="warning" round>50 spin</n-tag>
            <span style="margin-left: 8px">Andamento recente e conferma del trend</span>
          </n-list-item>
        </n-list>
      </n-space>
    </n-card>

    <n-card>
      <n-steps vertical>
        <n-step 
          title="Fase 1: Osservazione"
          description="Iniziare con puntate contenute per testare il tavolo"
          status="process"
        />
        <n-step
          title="Fase 2: Conferma"
          description="Aumentare gradualmente le puntate se la tendenza si conferma"
          status="process"
        />
        <n-step
          title="Fase 3: Gestione"
          description="Mantenere il controllo del bankroll e definire limiti chiari"
          status="process"
        />
      </n-steps>
    </n-card>

    <n-card>
      <n-space vertical>
        <n-statistic label="Budget Iniziale Consigliato">
          <n-number-animation
            ref="numberAnimation"
            :from="0"
            :to="300"
            :duration="3000"
            :active="true"
          >
            <template #prefix>€</template>
          </n-number-animation>
        </n-statistic>
        <n-collapse>
          <n-collapse-item title="Regole Fondamentali" name="1">
            <n-list>
              <n-list-item>✓ Stabilire un budget iniziale fisso</n-list-item>
              <n-list-item>✓ Incrementare le puntate solo in trend favorevole</n-list-item>
              <n-list-item>✓ Definire obiettivi di vincita realistici</n-list-item>
              <n-list-item>✓ Saper interrompere al momento giusto</n-list-item>
            </n-list>
          </n-collapse-item>
        </n-collapse>
      </n-space>
    </n-card>

    <n-card class="tutorial-footer">
      <template #header>
        <n-text type="warning">Nota Importante</n-text>
      </template>
      <n-text>
        Questo metodo non è una formula magica, ma un modello statistico che migliora le probabilità mantenendo un atteggiamento disciplinato. La fortuna rimane una componente ineliminabile del gioco.
      </n-text>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NTimeline,
  NTimelineItem,
  NText,
  NGradientText,
  NSpace,
  NList,
  NListItem,
  NTag,
  NAlert,
  NSteps,
  NStep,
  NStatistic,
  NNumberAnimation,
  NCollapse,
  NCollapseItem,
  NImage,
  NIcon
} from 'naive-ui'
import { 
  Database as DatabaseIcon,
  ChartBar as ChartBarIcon,
  Code as CodeIcon,
  Brush as BrushIcon
} from '@vicons/tabler'
import GlassCard from '../../components/Card/Card.vue'

const handleAction = (action: string) => {
  switch (action) {
    case 'edit':
      console.log('edit')
      break
    case 'delete':
      console.log('delete')
      break
  }
}
</script>

<style lang="scss" scoped>
.tutorial-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}

.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 6rem;
}

.creative-title, .creative-subtitle {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.highlight {
  color: #0ff0b3;
}

.hero-description {
  margin-top: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #a0a0a0;
}

.hero-image {
  position: relative;
  
  .glow-effect {
    border-radius: 1rem;
    box-shadow: 0 0 30px rgba(0, 255, 179, 0.3);
  }
}

.services-section {
  margin-bottom: 6rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-description {
  color: #a0a0a0;
  margin-bottom: 3rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.service-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .service-icon {
    color: #0ff0b3;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 1rem 0;
    font-size: 1.3rem;
  }

  p {
    color: #a0a0a0;
    line-height: 1.5;
  }
}

.about-section {
  .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .about-image {
    .glow-effect {
      border-radius: 1rem;
      box-shadow: 0 0 30px rgba(0, 255, 179, 0.3);
    }
  }

  .feature {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;

    .feature-icon {
      color: #0ff0b3;
    }

    .feature-content {
      h3 {
        margin: 0 0 0.5rem 0;
      }

      p {
        color: #a0a0a0;
        margin: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .hero-section,
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .creative-title,
  .creative-subtitle {
    font-size: 2.5rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>