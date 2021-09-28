export default function Home() {
  const handleOutageClick = () => {
    //Call an API to report outage
  }
  const handleResolutionClick = () => {
    //Call an API to resolve outage
  }

  return (
    <div>
      <button onClick={handleOutageClick}>Confirm Outage</button>
      <button onClick={handleResolutionClick}>Outage Resolved</button>
    </div>
  )
}
