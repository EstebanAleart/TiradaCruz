export const SITE_URL = 'https://tiradadecartas.com.ar'

export const getMesActual = () =>
  new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
