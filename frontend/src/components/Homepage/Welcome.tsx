import { MdArrowOutward } from 'react-icons/md'

const Welcome = (): JSX.Element => {
  return (
    <div className="w-full md:w-2/3">
      <div className="block">
        <h1 className="inline-block text-6xl lg:text-9xl bg-gradient-to-l from-primary to-black dark:to-white text-transparent bg-clip-text">
          Welcome.
        </h1>
      </div>
      <hr />
      <p className="text-2xl pt-4" style={{ boxShadow: 'rgb(0 0 0 / 11%) 0px -13px 14px -10px' }}>
        Authenticate to:
        {/*  */}
      </p>
      <ul className="mt-4 -ml-2">
        <li className="text-xl mb-2">
          <MdArrowOutward className="inline text-2xl animate-pulse" /> Search artists, genres
        </li>
        <li className="text-xl mb-2">
          <MdArrowOutward className="inline text-2xl animate-pulse" /> Find more artists by genre
        </li>
        <li className="text-xl mb-2">
          <MdArrowOutward className="inline text-2xl animate-pulse" /> Find duplicates on playlists
        </li>
        <li className="text-xl mb-2">
          <MdArrowOutward className="inline text-2xl animate-pulse" /> Check your user info
        </li>
      </ul>
    </div>
  )
}

export default Welcome
