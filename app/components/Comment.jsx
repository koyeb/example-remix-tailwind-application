import { Link } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { getItemComments } from '~/helper/fetch'

export default function Comment({ item }) {
  const [comment, setComment] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getItemComments(item).then((result) => {
      setComment(result)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex items-center space-x-4 p-4">
      {loading && <h3>Loading...</h3>}
      {!loading && comment && (
        <>
          <div className="text-orange-500 font-medium self-start place-self-start">
            {comment.score}
          </div>
          <div>
            {comment.text && !comment.deleted && (
              <div
                className="overflow-hidden text-sm text-gray-500"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: comment.text,
                }}
              />
            )}
            {comment.kids &&
              comment.kids.map((kid) => <Comment item={kid} key={kid} />)}
            <div className="flex space-x-1.5 text-xs text-gray-500">
              <span>
                by{' '}
                <Link className="hover:underline" to="/">
                  {comment.by}
                </Link>
              </span>
              <span>{comment.time}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
