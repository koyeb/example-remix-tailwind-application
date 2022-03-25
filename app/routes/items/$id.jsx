import { Link, useLoaderData } from 'remix'
import Comment from '~/components/Comment'
import { getItem } from '~/helper/fetch'

export const loader = async ({ params }) => {
  const res = await getItem(params.id)
  return res
}

export default function Post() {
  const item = useLoaderData()

  return (
    <div className="divide-y">
      <div className="flex items-center space-x-4 p-4">
        {item && (
          <>
            <div className="text-orange-500 font-medium self-start place-self-start ">
              {item.score}
            </div>
            <div>
              <h3 className="text-gray-700">
                <a href={item.url}>{item.title}</a>
              </h3>
              <div className="flex space-x-1.5 text-xs text-gray-500">
                <span>
                  by{' '}
                  <Link className="hover:underline" to="/">
                    {item.by}
                  </Link>
                </span>
                <span>{item.time}</span>
                <Link
                  className="hover:underline"
                  to={{ pathname: '/items', query: { id: item.id } }}
                >
                  {item.descendants} comments
                </Link>
              </div>
              {item.kids &&
                item.kids.map((comment) => (
                  <Comment item={comment} key={comment} />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
