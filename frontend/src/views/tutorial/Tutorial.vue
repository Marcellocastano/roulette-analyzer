<template>
  <div class="tutorial-container">
    <!-- Hero Section -->
    <section class="hero-section">


      <div class="hero-content">
        <n-h1 class="hero-title">{{ t('tutorial.hero.title') }}</n-h1>
        <n-p class="hero-description">
          {{ t('tutorial.hero.description') }}
        </n-p>
      </div>
    </section>

    <!-- Two Column Cards -->
    <div class="text-center mb-6">
      <n-h2 class="mb-0">{{ t('tutorial.concepts.title') }}</n-h2>
      <n-p class="mb-0">
        {{ t('tutorial.concepts.subtitle') }}
      </n-p>
    </div>
    <section class="three-column-section">
      <n-card class="feature-card">
        <n-h3>{{ t('tutorial.concepts.law_of_large_numbers.title') }}</n-h3>
        <n-p>
          {{ t('tutorial.concepts.law_of_large_numbers.content') }}
        </n-p>
      </n-card>
      <n-card class="feature-card">
        <n-h3>{{ t('tutorial.concepts.zero_zone.title') }}</n-h3>
        <n-p>
          {{ t('tutorial.concepts.zero_zone.content') }}
        </n-p>
      </n-card>
      <n-card class="feature-card">
        <n-h3>{{ t('tutorial.concepts.number_growth.title') }}</n-h3>
        <n-p>
          {{ t('tutorial.concepts.number_growth.content') }}
        </n-p>
      </n-card>
    </section>

    <div class="text-center mb-6">
      <n-h2 id="statistics" class="mb-0">{{ t('tutorial.statistics.title') }}</n-h2>
    </div>
    <section class="steps-section">
      <div class="two-column-section">
        <div class="column">
          <img src="/assets/images/statistics/dozens.png" alt="Dozens statistics" />
          <n-p v-html="t('tutorial.statistics.dozens.content')">
          </n-p>
          <img
            src="/assets/images/statistics/dozens-statistics-50.png"
            alt="Dozens statistics"
            width="70%"
            class="m-auto"
          />
        </div>
        <div class="column">
          <img
            src="/assets/images/statistics/wheel-statistics.png"
            alt="Wheel statistics"
            width="70%"
            class="m-auto"
          />
          <n-p v-html="t('tutorial.statistics.wheel.content')">
          </n-p>
          <img
            src="/assets/images/statistics/increase-numbers-500.png"
            alt="Wheel statistics"
            width="70%"
            class="m-auto"
          />
        </div>
      </div>
    </section>
    <!-- Two Column Section -->
    <section class="two-column-section mb-16">
      <div class="column">
        <n-h2>{{ t('tutorial.sequences.title') }}</n-h2>
        <n-p>
          {{ t('tutorial.sequences.content') }}
        </n-p>
      </div>
      <div class="column">
        <n-h2>{{ t('tutorial.number_trends.title') }}</n-h2>
        <n-p>
          {{ t('tutorial.number_trends.content') }}
        </n-p>
      </div>
    </section>

    <!-- Full Width Key Concept -->
    <section class="key-concept-section">
      <n-card class="concept-card">
        <n-h2>{{ t('tutorial.tips.title') }}</n-h2>
        <n-steps vertical class="stepper">
          <n-step :title="t('tutorial.tips.budget_management.title')" :description="t('tutorial.tips.budget_management.description')">
            <template #default>
              <n-p v-html="t('tutorial.tips.budget_management.content')">
              </n-p>
            </template>
          </n-step>

          <n-step :title="t('tutorial.tips.croupier_attention.title')" :description="t('tutorial.tips.croupier_attention.description')">
            <template #default>
              <n-p v-html="t('tutorial.tips.croupier_attention.content')">
              </n-p>
            </template>
          </n-step>

          <n-step :title="t('tutorial.tips.recommended_providers.title')" :description="t('tutorial.tips.recommended_providers.description')">
            <template #default>
              <n-p>
                {{ t('tutorial.tips.recommended_providers.content') }}
              </n-p>
            </template>
          </n-step>

          <n-step :title="t('tutorial.tips.table_screening.title')">
            <template #default>
              <n-p>
                {{ t('tutorial.tips.table_screening.content') }}
              </n-p>
            </template>
          </n-step>
        </n-steps>
      </n-card>
    </section>

    <div class="text-center mb-6">
      <n-h2 class="mb-0">{{ t('tutorial.betting.title') }}</n-h2>
    </div>
    <section class="bets-section">
      <div class="two-column-section">
        <div class="column">
          <n-p>
            {{ t('tutorial.betting.evolution_tables.content') }}
          </n-p>
          <img
            src="/assets/images/statistics/change-view.png"
            alt="Change view"
            width="70%"
            class="m-auto"
          />
          <n-p v-html="t('tutorial.betting.view_change.content')">
          </n-p>
        </div>
        <div class="column">
          <img
            src="/assets/images/statistics/best-way-bet.png"
            alt="Change view"
            width="90%"
            class="m-auto"
          />
        </div>
      </div>
    </section>

    <!-- Final Call to Action -->
    <section class="cta-section">
      <n-card class="cta-card">
        <n-h2>{{ t('tutorial.cta.title') }}</n-h2>
        <n-p v-html="t('tutorial.cta.content')">
        </n-p>
        <router-link to="/play">
          <n-button type="primary" size="large" class="bg-accent-dark">{{ t('tutorial.cta.button') }}</n-button>
        </router-link>
      </n-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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

  img {
    border-radius: 20px;
  }
}

// Hero Section
.hero-section {
  text-align: center;
  margin-bottom: 4rem;
  padding: 2rem;
  border-radius: 20px;
  background-image: linear-gradient(15deg, #ff5f58 0%, #454bff 100%);

  .hero-title {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #f4f4f4;
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
    background: rgba(255, 255, 255, 0.4);
    padding: 2rem;
    border-radius: 20px;
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

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.5rem;
    text-align: center;
  }
}

// Steps Section
.steps-section,
.bets-section {
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
    padding: 2rem;
    border-radius: 20px;
    background-image: linear-gradient(45deg, #ffcf00, #FF615A);
    background-size: 200% 200%;
    background-position: 0% 0%;
    transition: background-position 0.5s ease;

    &:hover {
      background-position: 100% 100%;
    }

    h2 {
      color: #fff;
      margin-bottom: 1rem;
    }

    p {
      color: #fff;
      margin-bottom: 2rem;
      font-size: 18px;
    }
  }
}
</style>
