const baseUrl = 'https://hacker-news.firebaseio.com/v0/'
const endpointSuffix = '.json'

export const getTopStories = async () => {
  const response = await fetch(`${baseUrl}topstories${endpointSuffix}`)

  return response.json()
}

export const getItem = async (itemId) => {
  const response = await fetch(`${baseUrl}item/${itemId}${endpointSuffix}`)

  return response.json()
}

export const getUser = async (userId) => {
  const response = await fetch(`${baseUrl}user/${userId}${endpointSuffix}`)

  return response.json()
}
