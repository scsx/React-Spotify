import { useEffect } from 'react'

import Hyperlink from '@/components/shared/Hyperlink'
import Text from '@/components/shared/Text'

const DevNotes = () => {
  const sections = [
    { title: 'AI', slug: 'ai' },
    { title: 'Skiley', slug: 'skiley' },
    { title: 'Backend', slug: 'backend' },
    { title: 'Colors', slug: 'colors' },
  ]

  const scrollToId = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })

      window.history.pushState(null, '', `#${id}`)
    }
  }

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      if (hash) {
        setTimeout(() => {
          scrollToId(hash)
        }, 100)
      }
    }

    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div className="container p-8 mx-auto max-w-4xl">
      <Text variant="h1" as="h1">
        Dev Notes
      </Text>

      {/* Table of Contents */}
      <nav className="my-8 p-4 bg-gray-900 border border-gray-700">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.slug}>
              <a
                href={`#${section.slug}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId(section.slug)
                }}
                className="text-gray-300 hover:text-green-400 transition-colors cursor-pointer"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <ul className="mt-16 space-y-12">
        <li>
          <Text variant="h3" as="h2" id="ai" className="font-bold pt-10 -mt-10 mb-4">
            AI
          </Text>
          <Text className="mb-4">Query for AI:</Text>
          <Text>
            Tenho um projecto que se liga à API do Spotify e LastFM. É um monorepo com /api para o
            backend, usa express para as chamadas às APIs e faz a auth PKCE e com /frontend para o
            frontend, usa react e tailwindcss. Estou a simular https em
            https://spotify-clone.local:5173 com mkcert e uso Loki para guardar a sessão no backend.
            Dá repostas curtas a maior parte do tempo porque só quero o código e explica quando te
            pedir detalhes. Nunca ponhas estilos como cores, sombras, rounded, etc, sem eu eu pedir.
            Fala sempre português comigo e o código é todo em inglês. Nunca uses canvas. Diz só sim
            ou não se percebeste para te fazer mais perguntas.
          </Text>
        </li>

        <li>
          <Text variant="h3" as="h2" id="skiley" className="font-bold pt-10 -mt-10 mb-4">
            Skiley.net
          </Text>
          <Text>Example to update local JSON (Liked Songs):</Text>
          <ol className="list-decimal pl-5 mt-4 space-y-2">
            <Text as="li">
              Login to{' '}
              <Hyperlink href="https://skiley.net/playlists" external>
                skiley.net
              </Hyperlink>{' '}
              with Spotify account.
            </Text>
            <Text as="li">
              Export playlist data to JSON (
              <pre className="inline-block">Playlists &gt; Liked Songs</pre>, check all options).
            </Text>
            <Text as="li">
              Save to <pre className="inline-block">\public\data\skiley</pre> with a name like{' '}
              <pre className="inline-block">2025-10-02-skiley-liked-songs.json</pre>
            </Text>
            <Text as="li">
              Update <pre className="inline-block">LikedSongs.tsx</pre>
            </Text>
          </ol>
        </li>

        <li>
          <Text variant="h3" as="h2" id="backend" className="font-bold pt-10 -mt-10 mb-4">
            Backend
          </Text>
          <Text>TODO</Text>
        </li>
        <li>
          <Text variant="h3" as="h2" id="colors" className="font-bold pt-10 -mt-10 mb-4">
            Colors
          </Text>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <Text as="li">
              <span className='text-primary'>Green</span> Spotify API content and primary color.
            </Text>
            <Text as="li">
              <span className='text-yellow-genius'>Yellow</span> Genius API content.
            </Text>
            <Text as="li">
              <span className='text-red-500'>Red</span> LastFM API content.
            </Text>
            <Text as="li">
              <span className='text-blue-500'>Blue</span> User actions.
            </Text>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default DevNotes
