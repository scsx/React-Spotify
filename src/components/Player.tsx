import { getCurrentlyPlaying } from "@/services/SpotifyPlayer"

const Player = (): JSX.Element => {
  getCurrentlyPlaying()
  return (
    <div>
      <p>Player</p>
    </div>
  )
}

export default Player
