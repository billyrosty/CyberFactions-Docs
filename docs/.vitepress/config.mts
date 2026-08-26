import { defineConfig } from 'vitepress'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'

const missingImagePlugin = {
  name: 'missing-image-fallback',
  resolveId(source: string, importer: string | undefined) {
    if (importer && /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/.test(source)) {
      const resolved = resolve(dirname(importer), source)
      if (!existsSync(resolved)) {
        return '\0missing-image'
      }
    }
    return null
  },
  load(id: string) {
    if (id === '\0missing-image') {
      return 'export default ""'
    }
    return null
  }
}

const base = '/CyberFactions-Docs/'

export default defineConfig({
  base,
  ignoreDeadLinks: true,
  vite: {
    plugins: [missingImagePlugin]
  },
  title: 'CyberFactions',
  description: 'Documentation for CyberFactions - The ultimate Minecraft Factions plugin',
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.ico` }]
  ],
  themeConfig: {
    // With siteTitle off the image is the only thing in the home link, so it
    // has to carry the accessible name itself.
    logo: { src: '/icon.png', alt: 'CyberFactions' },
    // The wordmark already spells the name; the text beside it would say it twice.
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Configuration', link: '/configuration/' },
      { text: 'Addons', link: '/addons/' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Multi-Server Setup', link: '/guide/multi-server' },
            { text: 'Configuration Presets', link: '/guide/presets' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Factions', link: '/guide/factions' },
            { text: 'Claims', link: '/guide/claims' },
            { text: 'Roles & Permissions', link: '/guide/roles' },
            { text: 'Relations', link: '/guide/relations' },
            { text: 'Quests', link: '/guide/quests' },
            { text: 'Upgrades', link: '/guide/upgrades' },
            { text: 'Cores', link: '/guide/cores' },
            { text: 'Shield', link: '/guide/shield' },
            { text: 'Taxes', link: '/guide/taxes' },
            { text: 'Web Map', link: '/guide/webmap' }
          ]
        },
        {
          text: 'Administration',
          items: [
            { text: 'Commands', link: '/guide/commands' },
            { text: 'Placeholders', link: '/guide/placeholders' },
            { text: 'Permissions', link: '/guide/permissions' }
          ]
        }
      ],
      '/configuration/': [
        {
          text: 'Configuration',
          items: [
            { text: 'Overview', link: '/configuration/' },
            { text: 'general.yml', link: '/configuration/general' },
            { text: 'databases.yml', link: '/configuration/databases' },
            { text: 'factions.yml', link: '/configuration/factions' },
            { text: 'lang.yml', link: '/configuration/lang' },
            { text: 'claims.yml', link: '/configuration/claims' },
            { text: 'combat.yml', link: '/configuration/combat' },
            { text: 'core.yml', link: '/configuration/core' },
            { text: 'menus.yml', link: '/configuration/menus' },
            { text: 'permissions.yml', link: '/configuration/permissions' },
            { text: 'quests.yml', link: '/configuration/quests' },
            { text: 'relations.yml', link: '/configuration/relations' },
            { text: 'roles.yml', link: '/configuration/roles' },
            { text: 'shield.yml', link: '/configuration/shield' },
            { text: 'taxes.yml', link: '/configuration/taxes' },
            { text: 'teleportation.yml', link: '/configuration/teleportation' },
            { text: 'top.yml', link: '/configuration/top' },
            { text: 'upgrades.yml', link: '/configuration/upgrades' },
            { text: 'webmap.yml', link: '/configuration/webmap' }
          ]
        }
      ],
      '/addons/': [
        {
          text: 'Addons',
          items: [
            { text: 'Overview', link: '/addons/' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'Developer API',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Getting Started', link: '/api/getting-started' }
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Services', link: '/api/services' },
            { text: 'Models', link: '/api/models' },
            { text: 'Events', link: '/api/events' },
            { text: 'Commands', link: '/api/commands' },
            { text: 'Registries', link: '/api/registries' }
          ]
        },
        {
          text: 'Guides',
          items: [
            { text: 'Threading', link: '/api/threading' },
            { text: 'Examples', link: '/api/examples' },
            { text: 'Addon Development', link: '/api/addon-development' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/cyberfactions' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'CyberFactions - Premium Minecraft Factions Plugin',
      copyright: '© 2024-2026 CyberFactions'
    },
    editLink: {
      pattern: 'https://github.com/your-org/cyberfactions-docs/edit/main/docs/:path',
      text: 'Edit this page'
    }
  }
})
