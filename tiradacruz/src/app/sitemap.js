import ciudades from '@/data/ciudades.json'
import tiposTirada from '@/data/tipos-tirada.json'
import arcanos from '@/data/arcanos.json'
import cartas from '@/data/cartas-espanolas.json'

const BASE = 'https://tiradadecartas.com.ar'
const now = new Date()

export default function sitemap() {
  const urls = []

  // Home
  urls.push({ url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 })

  // /tirada-de-cartas-espanolas/[tipo]
  for (const tipo of tiposTirada) {
    urls.push({
      url: `${BASE}/tirada-de-cartas-espanolas/${tipo.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  // /tirada-de-cartas-espanolas/[tipo]/[ciudad]
  for (const tipo of tiposTirada) {
    for (const ciudad of ciudades) {
      urls.push({
        url: `${BASE}/tirada-de-cartas-espanolas/${tipo.id}/${ciudad.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // /tirada-de-tarot/[tipo]
  for (const tipo of tiposTirada) {
    urls.push({
      url: `${BASE}/tirada-de-tarot/${tipo.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  // /tirada-de-tarot/[tipo]/[ciudad]
  for (const tipo of tiposTirada) {
    for (const ciudad of ciudades) {
      urls.push({
        url: `${BASE}/tirada-de-tarot/${tipo.id}/${ciudad.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // /arcano/[arcano]
  for (const arc of arcanos) {
    urls.push({
      url: `${BASE}/arcano/${arc.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    })
  }

  // /carta-espanola/[carta]
  for (const carta of cartas) {
    urls.push({
      url: `${BASE}/carta-espanola/${carta.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  // /tarot-gratis/[ciudad]
  for (const ciudad of ciudades) {
    urls.push({
      url: `${BASE}/tarot-gratis/${ciudad.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    })
  }

  // /tirada-gratis/[ciudad]
  for (const ciudad of ciudades) {
    urls.push({
      url: `${BASE}/tirada-gratis/${ciudad.id}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    })
  }

  return urls
}
