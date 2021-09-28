exports.handler = async (event) => {
  const clientStatus = event.body.status
  // grab credentials to assume a role

  // call eventbridge with those credentials

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
