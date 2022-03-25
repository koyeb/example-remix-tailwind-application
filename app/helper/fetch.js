const endpointPrefix = 'https://hacker-news.firebaseio.com/v0/';
const endpointSuffix = '.json';

export const getList = async (list) => {
  if (list) {
    const endpoint = `${endpointPrefix}${list}${endpointSuffix}`;
    const res = await fetch(endpoint);
    const json = await res.json();

    return json;
  }

  return null;
};

export const getItem = async (item) => {
  if (item) {
    const endpoint = `${endpointPrefix}item/${item}${endpointSuffix}`;
    const res = await fetch(endpoint);
    const json = await res.json();

    return json;
  }

  return null;
};

export const getItemComments = async (item) => {
    if (item) {
      const endpoint = `${endpointPrefix}item/${item}${endpointSuffix}`;
      const res = await fetch(endpoint);
      const json = await res.json();

      return json;
    }

    return null;
  };

export const getUser = async (user) => {
  if (user) {
    const endpoint = `${endpointPrefix}user/${user}${endpointSuffix}`;
    const res = await fetch(endpoint);
    const json = await res.json();

    return json;
  }

  return null;
};

