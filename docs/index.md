---
layout: home
hero:
  name: WebGPU Particle Fluid
  text: Technical Whitepaper
  tagline: High-performance GPU particle simulation with compute shaders. Explore the architecture behind 10,000 particles at 60 FPS.
  actions:
    - theme: brand
      text: Live Demo
      link: /demo/
    - theme: alt
      text: Read Whitepaper
      link: /en/whitepaper/architecture
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

onMounted(() => {
  const router = useRouter()
  const lang = navigator.language || navigator.userLanguage
  // Auto-detect language and redirect
  if (lang.startsWith('zh')) {
    router.go('/zh/')
  } else {
    router.go('/en/')
  }
})
</script>
