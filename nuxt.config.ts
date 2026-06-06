// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      title: "Tulis Izin Digital - Presisi Gambar Asli",
      meta: [
        { name: "description", content: "Buat surat izin digital dengan tulisan tangan asli yang rapi dan cepat." }
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Shadows+Into+Light&family=Indie+Flower&family=Kalam:wght@400;700&family=Caveat:wght@400;700&family=Architects+Daughter&family=Dancing+Script:wght@400;700&family=Homemade+Apple&family=Inter:wght@400;500;700;900&display=swap" }
      ]
    }
  },
  tailwindcss: {
    cssPath: "~/assets/css/globals.css",
    configPath: "~/tailwind.config.ts"
  }
});
