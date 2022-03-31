import { json, useLoaderData } from 'remix'
import Item from '~/components/Item'
import { getList } from '~/helper/fetch'

export const loader = async () => {
  const res = await getList('topstories')

  return json(await res.json())
}

export default function Index() {
  const itemIds = useLoaderData()

  return (
    <div className="divide-y">
      {itemIds.length > 0 &&
        itemIds.slice(0, 10).map((itemId) => {
          return <Item item={itemId} key={itemId} />
        })}
    </div>
  )
}
