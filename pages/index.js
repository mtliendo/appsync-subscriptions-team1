import { API } from 'aws-amplify'

export default function Home() {
  const updateStatus = async (status) => {
    const res = await API.post('team1api', '/status', {
      status,
    }).catch((e) => console.log(e))
    return res
  }
  const handleOutageClick = async () => {
    //Call an API to report outage
    updateStatus('UNHEALTHY')
  }
  const handleResolutionClick = () => {
    //Call an API to resolve outage
    updateStatus('HEALTHY')
  }

  return (
    <div>
      <h1>Team 1</h1>
      <button onClick={handleOutageClick}>Confirm Outage</button>
      <button onClick={handleResolutionClick}>Outage Resolved</button>
    </div>
  )
}
