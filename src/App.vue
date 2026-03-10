<template>
  <div class="app-shell">
    <section class="section1">
      <a href="index.html" class="brand-link">
        <img class="logo" src="./assets/logo-tienda.png" alt="Logo Tienda Boutique" />
      </a>

      <div class="title-wrap">
        <h1>Bienvenido a Tienda Boutique</h1>
      </div>

      <img class="build" src="./assets/imgbuild.png" alt="En construccion" />
    </section>

    <CurrentView />
  </div>
</template>

<script>
import CurrentView from './components/currentView.vue'

export default {
  name: 'App',
  components: {
    CurrentView
  }
}
</script>

<style scoped>
.app-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 12px;
}

.section1 {
  display: grid;
  grid-template-columns: minmax(150px, 230px) 1fr minmax(150px, 230px);
  align-items: center;
  gap: 14px;
  background: linear-gradient(130deg, #fff4e8 0%, #f8dce9 100%);
  border: 1px solid rgba(89, 56, 50, 0.18);
  box-shadow: 0 12px 28px rgba(56, 30, 27, 0.12);
  border-radius: 14px;
  width: 100%;
  min-height: 136px;
  padding: 16px 18px;
  margin-bottom: 18px;
}

h1 {
  margin: 0;
  text-align: center;
  color: #2f1b18;
  font-size: clamp(1.3rem, 2.8vw, 2rem);
  line-height: 1.15;
}

.title-wrap {
  display: flex;
  justify-content: center;
}

.brand-link {
  display: inline-flex;
  justify-content: flex-start;
}

.logo {
  width: min(100%, 200px);
  height: auto;
  object-fit: contain;
}

.build {
  width: min(100%, 200px);
  justify-self: end;
  height: auto;
  object-fit: contain;
}

@media (max-width: 900px) {
  .section1 {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 10px;
    min-height: auto;
  }

  .brand-link,
  .title-wrap,
  .build {
    justify-content: center;
    justify-self: center;
  }
}

@media (max-width: 768px) {
  .app-shell {
    padding: 0 8px;
  }

  .section1 {
    padding: 12px;
    margin-bottom: 12px;
  }

  .logo {
    width: min(100%, 150px);
  }

  .build {
    width: min(100%, 185px);
  }
}

@media (max-width: 480px) {
  .section1 {
    border-radius: 10px;
    padding: 10px;
  }

  h1 {
    font-size: 1.15rem;
  }
}
</style>
