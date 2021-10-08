import { API } from 'aws-amplify'

export default function Home() {
	const updateStatus = async (healthStatus) => {
		await API.post('team1Status', '/status', {
			body: { healthStatus },
		})
			.then((data) => console.log(data))
			.catch((e) => console.log(e))
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
