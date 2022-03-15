import { Link, json, useLoaderData } from 'remix'

export const loader = async () => {
  const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')

  return json(await res.json())
}

export default function Index() {
  const items = useLoaderData()

  console.log(items);

  return (
    <div className="divide-y">
      <div className="flex items-center space-x-4 p-4">
        <div className="text-orange-500 font-medium">453</div>
        <div>
          <h3 className="text-gray-700">
            <Link to="/">Some tiny personal programs I've written</Link>
            <span className="pl-1 text-sm text-gray-400">(jvns.ca)</span>
          </h3>
          <div className="flex space-x-1.5 text-xs text-gray-500">
            <span>
              by <Link className="hover:underline" to="/">atg_abhishek</Link>
            </span>
            <span>8 hours ago</span>
            <Link className="hover:underline" to="/">195 comments</Link>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 p-4">
        <div className="text-orange-500 font-medium">453</div>
        <div>
          <h3 className="text-gray-700">
            <Link to="/">Some tiny personal programs I've written</Link>
            <span className="pl-1 text-sm text-gray-400">(jvns.ca)</span>
          </h3>
          <div className="flex space-x-1.5 text-xs text-gray-500">
            <span>
              by <Link className="hover:underline" to="/">atg_abhishek</Link>
            </span>
            <span>8 hours ago</span>
            <Link className="hover:underline" to="/">195 comments</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
