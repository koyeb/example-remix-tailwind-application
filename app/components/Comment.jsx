import { Link } from '@remix-run/react'

export default function Comment({ comment }) {
  return (
    <div className="flex items-center space-x-4 p-4">
      {comment && (
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
