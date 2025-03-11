<template>
  <div class="tutorial-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <n-h1 class="hero-title">Come usare il software</n-h1>
        <n-p class="hero-description">
          Ricorda che questo strumento non è un generatore di numeri magici, ma un supporto progettato per aiutarti a giocare con una strategia basata su statistiche testate e consolidate. L’obiettivo è aumentare le probabilità di successo, ma è fondamentale applicare il metodo con attenzione e gestire il budget in modo responsabile.
        </n-p>
      </div>
    </section>

    <!-- Two Column Cards -->
    <div class="text-center mb-6">
      <n-h2 class="mb-0">Concetti base</n-h2>
      <n-p class="mb-0">
        La strategia si fonda su una serie di principi fondamentali che sfruttano logiche statistiche. Tra i concetti più importanti troviamo:
      </n-p>
    </div>
    <section class="three-column-section">
      <n-card class="feature-card">
        <n-h3>Legge dei grandi numeri</n-h3>
        <n-p>
          La legge dei grandi numeri applicata alla roulette significa che, su un altissimo numero di spin, la frequenza di uscita dei numeri o delle varie zone del tavolo tende a bilanciarsi. Questo, però, non va interpretato come un invito a puntare sulle "dozzine in difetto", perché la legge funziona solo su lunghissimi periodi. La strategia, quindi, consente di migliorare le probabilità di successo quando applicata correttamente insieme agli altri principi.
        </n-p>
      </n-card>
      <n-card class="feature-card">
        <n-h3>Zona Zero</n-h3>
        <n-p>
          Il metodo si concentra principalmente sulla "zona ZERO", ovvero i numeri compresi tra il 12 e il 15. Se la percentuale di uscita di questa zona è inferiore alla media (20%) sia a 50 che a 500 spin, la zona si considera "in ritardo". Un ritardo indica che questi numeri non stanno uscendo come atteso, creando uno squilibrio secondo la legge dei grandi numeri: potrebbe quindi essere il momento ideale per puntarci.
        </n-p>
      </n-card>
      <n-card class="feature-card">
        <n-h3>Crescita dei numeri</n-h3>
        <n-p>
          Le statistiche a 50 spin vengono confrontate con quelle a 500 spin per identificare i numeri "in crescita". I numeri che, partendo da una scarsa frequenza nei primi 50 spin, iniziano a recuperare nei successivi 500 sono da tenere in considerazione: questa crescita suggerisce che tenderanno a bilanciarsi nel tempo e potrebbero essere più frequenti nei prossimi spin.
        </n-p>
      </n-card>
    </section>

    <div class="text-center mb-6">
      <n-h2 id="statistics" class="mb-0">Inserimento delle statistiche</n-h2>
    </div>
    <section class="steps-section">
      <div class="two-column-section">
        <div class="column">
          <img src="/assets/images/statistics/dozens.png" alt="Dozens statistics" />
          <n-p>
            Per le dozzine, inserisci le <strong>percentuali riportate nelle statistiche del tavolo da gioco</strong>. Per la <strong>Zona ZERO %</strong> prendi la percentuale della sezione che include i numeri della zona (tra il 12 e il 15), non quella che comprende semplicemente il numero 0. Anche qui, verifica i dati sia sui 50 che sui 500 spin. Nell'immagine di esempio le statistiche sono a 50 spin, per visualizzare le statistiche a 500 spin è necessario fare <strong>lo swipe verso destra</strong>.
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
          <n-p>
            La mezza ruota del software ti permette di replicare graficamente le statistiche del tavolo da gioco. Per regolare il riempimento dei coni, clicca su uno di essi e muovi il cursore per adattare il livello di riempimento alle statistiche osservate sul tavolo. Ripeti il procedimento anche per le statistiche dei 500 spin.
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
        <n-h2>Sequenze</n-h2>
        <n-p>
          La strategia si basa su anni di analisi delle sequenze che si presentano in particolari condizioni statistiche. L'algoritmo rileva automaticamente quali numeri sono più favoriti in base alle statistiche attuali.
        </n-p>
      </div>
      <div class="column">
        <n-h2>Andamento dei numeri</n-h2>
        <n-p>
          Un fattore chiave è il monitoraggio dell’andamento dei numeri della "zona ZERO" (da 50 a 500 spin). L’ideale è individuare 2 o 3 numeri in crescita rispetto agli altri. "In crescita" significa che questi numeri hanno una bassa frequenza nei primi 50 spin, ma mostrano un incremento nei successivi 500. Questi numeri tendono a bilanciarsi nel lungo periodo e sono quindi quelli da considerare maggiormente.
        </n-p>
      </div>
    </section>

    <!-- Full Width Key Concept -->
    <section class="key-concept-section">
      <n-card class="concept-card">
        <n-h2>Consigli di gioco e osservazioni</n-h2>
        <n-steps vertical class="stepper">
          <n-step title="Gestione del budget" description="Disciplina di gioco">
            <template #default>
              <n-p>
                Parti con un budget di almeno 300€ per sessione. Stabilisci un obiettivo realistico di guadagno e smetti di giocare una volta raggiunto.
                <br />
                Inizia puntando piccole somme per testare il tavolo e aumenta gradualmente in caso di vincite. I numeri generati dal software sono suddivisi in tre intensità di puntata: giallo (più basso), arancione (intermedio) e rosso (più alto).
                <br />
                Ad esempio: 1€ per ogni numero giallo, 3€ per i numeri arancioni e 5€ per quelli rossi. In caso di vincite, puoi aumentare gradualmente le puntate.
                <br />
                Evita di continuare a giocare in caso di perdite: insistere potrebbe causare ulteriori danni alle tue finanze. Gioca solo i soldi che puoi permetterti di perdere.
              </n-p>
            </template>
          </n-step>

          <n-step title="Attenzione al croupier" description="Tecnica di lancio">
            <template #default>
              <n-p>
                Quando osservate un tavolo fate anche <strong>molta attenzione a come effettua lo spin il croupier</strong>. Lo spin va fatto facendo ripartire la pallina (più o meno) all'<strong>altezza dell'ultimo numero estratto</strong>. Se ad esempio l'ultimo numero estratto è un 5, il croupier dovrebbe invertire il giro della ruota, prendere la pallina e farla ripartire all'altezza del 5. Se lancia la pallina troppo distante dall’ultimo numero estratto o tarda nell’avviare lo spin, potrebbe compromettere le sequenze statistiche. <strong>In questi casi, il tavolo è da evitare, anche se le condizioni sembrano favorevoli.</strong>
              </n-p>
            </template>
          </n-step>

          <n-step title="Provider consigliati" description="Selezione dei tavoli">
            <template #default>
              <n-p>
                Consiglio i tavoli Evolution, che offrono statistiche sia a 50 che a 500 spin, perfettamente compatibili con questa strategia. Sconsiglio invece i tavoli Playtech, poiché mostrano le statistiche solo a 100 e 1000 spin, meno utili per questo metodo. A dimostrazione del fatto che anche i provider si stanno adattando per contrastare la nostra strategia.
              </n-p>
            </template>
          </n-step>

          <n-step title="Scrematura dei tavoli">
            <template #default>
              <n-p>
                Impara a individuare rapidamente un tavolo favorevole (o almeno borderline) analizzando le statistiche autonomamente. Questo ti farà risparmiare tempo nella compilazione e ti aiuterà a scegliere tavoli con condizioni ottimali.
              </n-p>
            </template>
          </n-step>
        </n-steps>
      </n-card>
    </section>

    <div class="text-center mb-6">
      <n-h2 class="mb-0">Come puntare velocemente</n-h2>
    </div>
    <section class="bets-section">
      <div class="two-column-section">
        <div class="column">
          <n-p>
            Su tavoli Evolution, clicca sull’icona della telecamera in alto a destra per cambiare visuale: potrai selezionare velocemente i numeri utilizzando l’ellisse dei numeri o la ruota.
          </n-p>
          <img
            src="/assets/images/statistics/change-view.png"
            alt="Change view"
            width="70%"
            class="m-auto"
          />
          <n-p>
            Dopo aver cliccato cambierà la visuale del tavolo, che metterrà in risalto l'
            <strong>ellisse dei numeri</strong> e la <strong>ruota</strong>. Useremo questi due strumenti per <strong>puntare velocemente</strong>. Infatti la piccola sezione in basso a destra (vedi immagine) con il numero 1 con sopra il + e sotto il -, indica che cliccando su un numero sull'ellisse dei numeri accanto, <strong>verrà effettuata la puntata su quel numero e al primo numero subito sopra e subito sotto.</strong> Se il numero è 2 verrà effettuata la puntata sul numero selezionato e ai primi 2 numeri subito sopra e sotto. E così via..
            <br />
            Se invece clicchi sul cono della ruota, la puntata sarà solo sul numero selezionato. Con un po’ di pratica, questo sistema risulterà il metodo più veloce e preciso per replicare le puntate indicate dal software.
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
        <n-h2>Pronto a giocare?</n-h2>
        <n-p>
          Mettiti in gioco e sfida la roulette, ma ricorda sempre: questo non è uno strumento che garantisce vincite, piuttosto una guida per giocare con un metodo affidabile e basato sulle statistiche.
          Gioca con moderazione, sii sempre prudente e <strong><u>gioca solo i soldi che puoi permetterti di perdere!</u></strong><br/>Buona fortuna!
        </n-p>
        <router-link to="/play">
          <n-button type="primary" size="large" class="bg-accent-dark">Gioca</n-button>
        </router-link>
      </n-card>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

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
  background-image: linear-gradient(15deg, #4d6647 0%, #5b9a7c 100%);

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
    background-image: linear-gradient(45deg, #fad225, var(--accent-color-dark));
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
