export async function get(EP: string) {
  const res = await fetch('/api' + EP, {
    method: 'GET',
    headers: { contentType: 'application/json' },
  })
  return await res.json()
}

export async function post(EP: string, body: any, headers: any = {}) {
  const res = await fetch('/api' + EP, {
    method: 'POST',
    headers: { contentType: 'application/json', ...headers },
    body: JSON.stringify(body),
  })
  return await res.json()
}

export async function graphql(
  query: string,
  options?: {
    headers?: any
    isMutation?: boolean
  },
): Promise<[any, any]> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    body: JSON.stringify({
      // variables: variables,
      ...(options?.isMutation
        ? {
          query: query.replace(/(\r\n|\n|\r|\t)/gm, ' ').replace(/  +/g, ' '),
        }
        : {
          query: query.replace(/(\r\n|\n|\r|\t)/gm, ' ').replace(/  +/g, ' '),
        }),
    }),
  })

  const res = await response.json()

  if (res.errors) console.error('graphql error:', res.errors)

  return [res.data, res.errors]
}
