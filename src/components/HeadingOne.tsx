const HeadingOne: React.FC<{ text: string, classes?: string }> = ({ text, classes = 'text-3xl md:text-6xl font-semibold mb-6 tracking-wide' }) => {
  return <h1 className={classes}>{text}</h1>
}

export default HeadingOne
