const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const eventBridge = new AWS.EventBridge()

exports.handler = async (event) => {
	const { healthStatus } = JSON.parse(event.body)

	// todo 1: setup the params
	const params = {
		Entries: [
			{
				EventBusName: 'healthStatus',
				Source: 'team.status',
				DetailType: 'Order Notification',
				Detail: JSON.stringify({ healthStatus }),
			},
		],
	}

	// todo 2: send the event to Amazon EventBridge
	try {
		const data = await eventBridge.putEvents(params).promise()
		console.log(
			`Event sent to the event bus ${params.Entries[0].EventBusName} with ID ${data.Entries[0].EventId}`
		)
	} catch (err) {
		console.log('error:', err.stack)
	}

	// todo 3: return something back to the frontend

	const response = {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
		},
		body: JSON.stringify('Hello from Lambda!'),
	}
	return response
}
