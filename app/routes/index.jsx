import { useLoaderData } from '@remix-run/react'
import Item from '~/components/Item'
import { getTopStories, getItem } from '~/helper/fetch'

export const loader = async () => {
  const topStoryIds = await getTopStories()

  const items = await Promise.all(
    topStoryIds.slice(0, 10).map(async (itemId) => await getItem(itemId))
  )

  return items
}

export default function Index() {
  const items = useLoaderData()

  return (
    <div className="divide-y">
      {items.length > 0 &&
        items.map((item) => {
          return <Item item={item} key={item.id} />
        })}
    </div>
  )
}
