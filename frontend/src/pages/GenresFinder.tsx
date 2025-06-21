import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { TSpotifyArtist } from '@/types/SpotifyArtist'
import axios from 'axios'
import { FaSpotify } from 'react-icons/fa'
import { ImLastfm2 } from 'react-icons/im'

import CardArtist from '@/components/CardArtist'
import HeadingOne from '@/components/HeadingOne'
import { Badge } from '@/components/ui/badge'

import { useToken } from '@/contexts/TokenContext'

import spotifySearch from '@/services/spotify/spotifySearch'

const GenresFinder = (): JSX.Element => {
  const initialArtistState: TSpotifyArtist[] = []
  const { genresNames } = useParams()
  const token = useToken()

  const [spotifyGenres, setSpotifyGenres] = useState<string[]>([])
  const [lastFmGenres, setLastFmGenres] = useState<string[]>([])
  const [artistsSpotify, setArtistsSpotify] = useState(initialArtistState)

  // Get genres by params.
  useEffect(() => {
    if (genresNames) {
      const allGenres: string[] = genresNames.split(',').map((genre) => genre.trim())

      const newSpotifyGenres: string[] = []
      const newLastFmGenres: string[] = []

      allGenres.forEach((genre) => {
        if (genre.startsWith('spotify:')) {
          newSpotifyGenres.push(genre.substring('spotify:'.length))
        } else if (genre.startsWith('lastfm:')) {
          newLastFmGenres.push(genre.substring('lastfm:'.length))
        }
      })

      setSpotifyGenres(newSpotifyGenres)
      setLastFmGenres(newLastFmGenres)
    }
  }, [genresNames])

  // Search for Spotify genres/tags.
  // E.g. with no query and two genres: https://api.spotify.com/v1/search?q=genre:nu-gaze,indie-punk&type=artist
  useEffect(() => {
    if (spotifyGenres.length > 0) {
      // Search Spotify.
      const formattedGenres = spotifyGenres.map((genre) => genre.replace(/\s+/g, '-')).join(',')
      async function fetchGenreArtists() {
        const results = await spotifySearch('', 'artist', formattedGenres)
        setArtistsSpotify(results.items as TSpotifyArtist[])
      }

      // Search LastFM.
      const searchLastFmForSpotifyGenres = async () => {
        try {
          if (token) {
            for (const tag of spotifyGenres) {
              const lastFmResponse = await axios.get(
                `https://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=${encodeURIComponent(
                  tag
                )}&api_key=${token.lastFMKey}&format=json`
              )
              // Do something.
              console.log(lastFmResponse)
            }
            /* const lastFmResponse = await axios.get(
            `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
              fetchedArtist.name
            )}&api_key=${token.lastFMKey}&format=json`
          )
          setLastFmArtist(lastFmResponse.data.artist)

          lastFmTags = lastFmResponse.data.artist.tags.tag.map((tag: any) => {
            return {
              name: tag.name,
              url: tag.url
            }
          })

          if (lastFmTags) {
            setLastFmArtistTags(lastFmTags)
          } */
          }
        } catch (error) {
          console.error('Spotify tag(s) were not found in LastFM', error)
        }
      }

      fetchGenreArtists()
      searchLastFmForSpotifyGenres()
    }
  }, [spotifyGenres])

  // Search for LastFM genres/tags.
  useEffect(() => {
    // Get LastFM tags info.
    const fetchLastFmTagsInfo = async () => {
      try {
        if (token) {
          if (lastFmGenres.length > 0) {
            for (const tag of lastFmGenres) {
              const lastFmResponse = await axios.get(
                `https://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=${encodeURIComponent(
                  tag
                )}&api_key=${token.lastFMKey}&format=json`
              )
              // Do something.
              console.log(lastFmResponse)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching tag info:', error)
      }
    }

    fetchLastFmTagsInfo()
  }, [lastFmGenres])

  return (
    <div className="container flex flex-col flex-1 justify-center">
      <HeadingOne text="Genres Finder" />

      <div className="genres__results flex mt-4">
        <div className="genres__spotify flex-1 mr-4">
          <h3 className="text-xl mb-4">
            <FaSpotify className="inline-block text-primary mr-1" /> Spotify Results for{' '}
            {spotifyGenres.map((genre, index) => (
              <Badge key={index} variant="outline" className="font-normal text-sm">
                {genre}
              </Badge>
            ))}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {artistsSpotify.length > 0 &&
              artistsSpotify.map((artist) => (
                <CardArtist
                  key={artist.id}
                  artist={artist}
                  classes={`mb-1 col-span-2 md:col-span-1`}
                />
              ))}
          </div>
        </div>
        <div className="genres__lastfm flex-1 ml-4">
          <h3 className="text-xl mb-4">
            <ImLastfm2 className="inline-block text-red-500 mr-2" /> LastFM Results for{' '}
            {spotifyGenres.map((genre, index) => (
              <Badge key={index} variant="outline" className="font-normal text-sm">
                {genre}
              </Badge>
            ))}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default GenresFinder
