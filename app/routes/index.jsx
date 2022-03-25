import { Link, json, useLoaderData } from 'remix'
import Item from '~/components/Item'

export const loader = async () => {
  const res = await fetch(
    'https://hacker-news.firebaseio.com/v0/topstories.json'
  )

  return json(await res.json())
}

export default function Index() {
  const items = useLoaderData()

  return (
    <div className="divide-y">
      {items.length > 0 &&
        items.slice(0, 10).map((itemId) => {
          return <Item item={itemId} key={itemId} />
        })}
    </div>
  )
}
