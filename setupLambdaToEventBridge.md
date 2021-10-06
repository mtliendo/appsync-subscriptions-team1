# How to get a function to publish an event to EventBridge

> SDK docs for EventBridge: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EventBridge.html#putEvents-property

> Free AWS Event-Driven Workshop: https://event-driven-architecture.workshop.aws

### Project Setup

This flow will work well when you have separate teams working within the same AWS Account.

1. Install Amplify CLI

- `npm i -g @aws-amplify/cli`

2. Install the Amplify dependencies in the project folder

- `npm i aws-amplify @aws-amplify/ui-react`

3. Initialize the project with Amplify

- `amplify init`
- Follow the prompts

4. Add Auth if wanting authenticated access

- `amplify add auth`

5. Add an API

- `amplify add api`
- Provide a friendly API name
- Provide an API path
- Provide a friendly function name
- Select `create` as an option for (un)authenticated users to have.

6. Update the function code to look like the following:

```js
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
```

7. Update the functions role to include the following IAM policy:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "VisualEditor0",
			"Effect": "Allow",
			"Action": "events:PutEvents",
			"Resource": "arn:aws:events:{YOUR_REGION}:{YOUR_ACCOUNT_NUMBER}:event-bus/{YOUR_EVENTBUS_NAME}"
		}
	]
}
```

8. Push up the resources

- `amplify push`

### Working with EventBridge

1. In the AWS Console, search for EventBridge and on the left sidebar, Select "Event buses" under "Events".
2. Select "Create event bus"

- Give it a name
- Select "Create"

3. Back in the left sidebar, select "Rules" under "Events".
4. Select the event bus you'd like to use and click "Create Rule".
5. Give the rule a name and a description.
6. Select the event pattern JSON you'd like to use to match by.

- eg: `{"source": ["team.status"]}`
- Ensure the rule is enabled and the event bus is selected.

7. To log to Cloudwatch, under targets, select "Cloudwatch log group"
8. **IMPORTANT**: At the time of this writing, for permissions to be correctly set, the log group **must** start with `/aws/events/`.

### Testing

1. Configure the project to use Amplify libraries

```js
import Amplify from 'aws-amplify'
import config from '../aws-exports'
import { withAuthenticator } from '@aws-amplify/ui-react'
Amplify.configure(config)
function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />
}

export default withAuthenticator(MyApp)
```

2. Use the `API` library to make the call

```js
import { API } from 'aws-amplify'

export default function Home() {
	const updateStatus = async () => {
		await API.post('YOUR_API_NAME', '/your-api-path', {
			body: { healthStatus: 'UNHEALTHY' }, // automatically stringified
		})
			.then((data) => console.log(data))
			.catch((e) => console.log(e))
	}

	return <button onClick={updateStatus}>Confirm Outage</button>
}
```

3. Start the application and confirm both the Lambda logs and EventBridge logs in Cloudwatch.
