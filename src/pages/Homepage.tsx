import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useToken } from '../contexts/TokenContext'
import { SpotifyArtist } from '../types/SpotifyArtist'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Welcome from '@/components/Welcome'

interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[]
  }
}

const exampleTable = (
  <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className='w-[100px]'>Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Method</TableHead>
        <TableHead className='text-right'>Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className='font-medium'>INV001</TableCell>
        <TableCell>Paid</TableCell>
        <TableCell>Credit Card</TableCell>
        <TableCell className='text-right'>$250.00</TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

const Homepage = (): JSX.Element => {
  const initialState: SpotifyArtist[] = []

  const [searchKey, setSearchKey] = useState('')
  const [artists, setArtists] = useState(initialState)
  const searchArtists = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const { data }: { data: SpotifySearchResponse } = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: 'artist'
        }
      }
    )

    const { items }: { items: SpotifyArtist[] } = data.artists
    setArtists(items)
  }

  const token = useToken()
  // console.log('Token:', token)

  const renderArtists = (): JSX.Element[] => {
    return artists.map((artist) => {
      return (
        <div key={artist.id}>
          <p>Image here</p>
          {artist.name}
        </div>
      )
    })
  }

  return (
    <div className='home container flex flex-col flex-1 justify-center'>
      {/*  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          return exampleTable
        })}
 */}
      {token ? (
        <form onSubmit={searchArtists}>
          <input type='text' onChange={(e) => setSearchKey(e.target.value)} />
          <button type='submit'>Search</button>
        </form>
      ) : (
        <Welcome />
      )}

      <div>{renderArtists()}</div>
    </div>
  )
}

export default Homepage
