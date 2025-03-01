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
      <n-p class="mb-0 fontSizeHuge">
        A grandi linee il concetto fondamentale su cui si basa la strategia è una serie di fattori
        messi insieme, tra cui:
      </n-p>
    </div>
    <section class="three-column-section">
      <n-card class="feature-card">
        <n-h3>Legge dei grandi numeri</n-h3>
        <n-p>
          Nel contesto della roulette, questo significa che, su un numero molto alto di spin,
          <strong>
            le probabilità di uscita dei vari numeri e delle diverse zone del tavolo
            <u>tenderanno ad equilibrarsi</u>
          </strong>
          . Questo ovviamente non significa andare a constatare la dozzina "in difetto" e puntare su
          quei numeri. È importante sottolineare che la legge dei grandi numeri si applica solo su
          un numero elevato di osservazioni. Pertanto, la strategia non garantisce la vincita, ma
          aumenta le probabilità di successo se applicata correttamente e con una
          <strong>gestione oculata del budget</strong>
        </n-p>
      </n-card>
      <n-card class="feature-card">
        <n-h3>Zona Zero</n-h3>
        <n-p>
          La strategia è sviluppata per funzionare al meglio sfruttando la zona ZERO della roulette,
          cioè quei numeri che vanno da 12 al 15. Se la percentuale di uscita della zona zero è
          <strong>inferiore alla media (20%)</strong>
          sia a 50 che a 500 spin, si considera che la zona sia "
          <strong>in difetto</strong>
          ". Questo suggerisce che la zona è in ritardo e che potrebbe essere il momento di puntare
          sui suoi numeri. Il ritardo nella zona zero indica che i numeri in quella zona non stanno
          uscendo con la frequenza attesa, creando uno squilibrio rispetto alla legge dei grandi
          numeri
        </n-p>
      </n-card>
      <n-card class="feature-card">
        <n-h3>Crescita dei numeri</n-h3>
        <n-p>
          Si confrontano le statistiche a 50 spin con quelle a 500 spin per individuare i numeri che
          mostrano una
          <strong>tendenza positiva</strong>
          . I numeri in crescita sono quelli che a 50 spin, mostrano un
          <strong>aumento della frequenza di uscita</strong>
          se si considera un periodo più ampio, fino a 500 spin. Questi numeri sono considerati
          promettenti perchè il loro aumento suggerisce che stanno iniziando a "
          <strong>recuperare</strong>
          il ritardo e che potrebbero diventare più frequenti nei prossimi spin.
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
            Le input riguardanti le dozzine vanno popolate inserendo le
            <strong>percentuali presenti nelle statistiche del tavolo</strong>
            . Invece per quanto riguarda l'input
            <strong>Zona ZERO %</strong>
            va presa la percentuale della sezione
            <strong>ZERO</strong>
            e
            <u>non quella dove c'è il numero 0</u>
            .
            <strong>Sia a 50 che a 500 spin.</strong>
            Nell'immagine di esempio le statistiche sono a 50 spin, per visualizzare le statistiche
            a 500 spin è necessario fare
            <strong>lo swipe verso destra</strong>
            .
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
            La mezza ruota vuole replicare la ruota delle statistiche del tavolo da gioco. In questa
            fase bisogna
            <strong>regolare il riempimento dei coni</strong>
            in modo che risultino il più simili possibili a quelle del tavolo. Per fare ciò fai
            <strong>lo click all'interno di un cono</strong>
            e regola il livello di riempimento
            <strong>postando il cursore in alto e in basso</strong>
            . Le due immagini spiegano la pratica su come regolare il riempimento dei coni. Anche in
            questo caso, facendo lo swipe verso destra, si arriva ai 500 spin e si ripete il
            procedimento.
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
          La strategia posa le sue fondamenta su un
          <strong>sistema di sequenze analizzato e monitorato</strong>
          negli anni. Ho notato nel tempo che in determinate condizioni statistiche del tavolo, si
          presentavano spesso determinate sequenze. L'algoritmo quindi calcola
          <strong>in automatico</strong>
          e in base alle statistiche quali numeri consigliare.
        </n-p>
      </div>
      <div class="column">
        <n-h2>Andamento dei numeri</n-h2>
        <n-p>
          L'algoritmo tiene in considerazione l'
          <strong>andamento dei numeri</strong>
          della zona zero da 50 a 500 spin. Le condizioni ottimali si avranno quando ci saranno
          <strong>2 o 3 numeri in crescita</strong>
          rispetto agli altri. In crescita significa che presentano un basso numero di uscita nei 50
          spin, ma un alto numero nei 500 spin. Questa statistica indica che questi numeri
          <strong>tenderanno ad equilibrarsi</strong>
          e per questo motivo sono quelli da tenere in maggiore considerazione rispetto agli altri.
        </n-p>
      </div>
    </section>

    <!-- Full Width Key Concept -->
    <section class="key-concept-section">
      <n-card class="concept-card">
        <n-h2>Consigli di gioco e osservazioni</n-h2>
        <n-p>
          Una volta comprese e assimilate queste informazioni, è possibile fare una
          <strong>scrematura in autonomia</strong>
          delle statistiche di ogni tavolo. Questo ti permetterà di
          <strong>perdere meno tempo</strong>
          per la compilazione delle statistiche, in quanto riuscirete a trovare al primo colpo un
          tavolo con condizioni favorevoli (o al limite borderline).
          <br />
          Quando osservate un tavolo fate anche
          <strong>molta attenzione a come effettua lo spin in croupier</strong>
          . Lo spin va fatto facendo partire la pallina (più o meno) all'
          <strong>altezza dell'ultimo numero estratto</strong>
          . Se ad esempio l'ultimo numero estratto è un 5, il croupier dovrebbe invertire il giro
          della ruota, prendere la pallina e farla ripartire all'altezza del 5. Se dovesse, invece,
          perdere tempo e far partire la pallina all'altezza di un numero molto distante dal 5
          influirebbe decisamente sulle sequenze.
          <strong>
            In questi casi il tavolo è da evitare, anche in condizioni potenzialmente favorevoli.
          </strong>
          <br />
          Il budget consigliato da predisporre per ogni sessione è di 300€.
          <strong>Prefissatevi sempre un attivo da raggiungere</strong>
          e una volta raggiunto, smettete di giocare.
          <strong>In caso di perdita</strong>
          , lasciate il tavolo e smettete di giocare. Continuare ad insistere potrebbe essere molto
          deleterio per voi e per le vostre finanze. Ci saranno sempre dei tavoli con condizioni
          ottimali,
          <strong>bisogna avere la pazienza di trovarli e provare nuovamente.</strong>
          <br />
          Come
          <strong>provider di gioco</strong>
          , consiglio i tavoli di
          <strong>Evolution</strong>
          , in quanto in base al sito hanno un gran numero di tavoli, inoltre le statistiche sono
          facilmente consultabili sia a 50 che a 500 spin. Invece non consiglio
          <strong>Playtech</strong>
          perché mostra le statistiche solo a 100 e 1000 spin, il che non è ottimale per la
          strategia su cui si fonda il software.
        </n-p>
      </n-card>
    </section>

    <!-- Final Call to Action -->
    <section class="cta-section">
      <n-card class="cta-card">
        <n-h2>Pronto per iniziare?</n-h2>
        <n-p>
          Mettiti in gioco e sfida la Roulette. Ricorda sempre che
          <strong>questo non è uno strumento di generazione di numeri magici</strong>
          , ma ti aiuta a giocare con un metodo testato e consolidato nel tempo. Fai sempre
          attenzione e soprattutto,
          <strong><u>gioca solo i soldi che puoi permetterti di perdere!</u></strong>
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
    background: rgba(255, 255, 255, 0.50);
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
  border: 2px solid var(--accent-color-dark);

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
    padding: 2rem;
    border-radius: 20px;
    background-image: linear-gradient(45deg, var(--secondary-color), #00a1ff);
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
