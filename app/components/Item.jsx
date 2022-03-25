import { Link } from 'remix'
import { useEffect, useState } from 'react'
import { getItem } from '~/helper/fetch'

export default function Item({ item: itemId }) {
  const [item, setItem] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getItem(itemId).then((result) => {
      setItem(result)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex items-center space-x-4 p-4">
      {loading && <h3>Loading...</h3>}
      {!loading && item && (
        <>
          <div className="text-orange-500 font-medium self-start place-self-start ">
            {item.score}
          </div>
          <div>
            <h3 className="text-gray-700">
              <a href={item.url}>{item.title}</a>
              <span className="pl-1 text-sm text-gray-400"></span>
            </h3>

            <div className="flex space-x-1.5 text-xs text-gray-500">
              <span>
                by{' '}
                <Link className="hover:underline" to="/">
                  {item.by}
                </Link>
              </span>
              <span>{item.time}</span>
              <Link className="hover:underline" to={`/items/${item.id}`}>
                {item.descendants} comments
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
