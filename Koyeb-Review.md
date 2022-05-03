---
title: "Deploy a Remix app using Tailwind"
description: "Discover how to build a Remix application using Tailwind and deploy it on to the Koyeb Serverless Platform."
tags: ["Remix", "React", "Tailwind"]
editUrl: "pages/tutorials/deploy-a-remix-app-using-tailwind"
lastEdited: "2022-03-15T00:00:00.000Z"
authors:
  - fullname: "Chimezie Enyinnaya"
    twitter: "ammezie"
    avatar: "/static/images/team/cenyinnaya.jpg"
---

## Introduction

[Remix](https://remix.run/) is a fullstack web framework that lets you focus on the user interface and work back through web fundamentals to deliver a fast, slick, and resilient user experience. It's a React Framework that provides APIs and conventions for server rendering, data loading, routing, and more.

In this guide, we are going to look at what is Remix and how to get started with it by building a simple Hacker News clone. The application will focus mainly on fetching and displaying data from the Hacker News API. Also, we’ll be using Tailwind CSS for styling the application. In the end, we’ll look at how to deploy the Remix app on Koyeb.

## Requirements

To successfully follow and complete this guide, you need:

- A local development environment with [Node.js](https://nodejs.org/) 14 or greater and [npm](https://npmjs.com) 7 or greater installed
- A [GitHub account] to version and deploy your application code on Koyeb
- A [Koyeb account] to deploy and run the application

## Steps

To deploy the Remix application using Tailwind, you need to follow these steps:

1. Create a new Remix app
2. Add Tailwind CSS to the App
3. Define the Remix application routes
4. Build the components of our application
5. Deploy to Koyeb

## Create a new Remix app

Let’s get started by creating a new Remix project. Open your terminal and run the following command:

```bash
npx create-remix@latest remix-hacker-news
```

`npx` allows us to execute npm packages binaries (`create-remix` in our case) without having to first install it.

At the prompt, choose **Just the basics** then **Remix App Server,** and then **JavaScript.** 

Finally, install the npm dependencies by selecting `Y` when prompted.

Once that’s done, you can change into the project directory and start the app:

```bash
cd remix-hacker-news
npm run dev
```

The app should be running on [localhost:3000](http://localhost:3000). We are going to leave it running as we continue to build the app.

## Add Tailwind CSS to the App

For styling the app, we’ll be using Tailwind CSS, so let’s install and set it up:

```bash
npm install -D tailwindcss postcss autoprefixer concurrently
```

* `postcss`: for transforming styles with JS plugins.
* `autoprefixer`: for automatically applying vendor prefixes to CSS.
* `concurrently`: for running multiple commands concurrently.

Next, run the `init` command to create `tailwind.config.js`:

```bash
npx tailwindcss init -p
```

Using `-p` (short for `--postcss`) flag instruct Tailwind CSS to initialize a `postcss.config.js` file in addition to the `tailwind.config.js` file.

Next, we need to make use of Tailwind directives in our CSS file. Directives are custom Tailwind-specific at-rules that offer special functionalities for Tailwind CSS projects.

Create a `styles` directory in the root of the project and inside it create an `app.css` file and add the snippet below in it:

```css
/* styles/app.css */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Since Tailwind scans our HTML, JavaScript components, and any other template files for class names, then generate all of the corresponding CSS for those styles, we need to configure our template paths so that Tailwind can generate all the CSS we need. We can do that by updating the `content` section of `tailwind.config.js`:

```jsx
// tailwind.config.js

module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
	],
}
```

We need to add a new command to our application to successfully compile the CSS. Update the `scripts` section in your `package.json` file to build both the development and production CSS with the following command:

```json
// package.json

"scripts": {
	"build": "npm run build:css && remix build",
	"build:css": "tailwindcss -m -i ./styles/app.css -o app/styles/app.css",	
  "dev": "concurrently \"npm run dev:css\" \"remix dev\"",
	"dev:css": "tailwindcss -w -i ./styles/app.css -o app/styles/app.css",
}
```

Now, when we run `npm run dev`, Tailwind CSS will be compiled and saved inside `app/styles/app.css`.

Lastly, we will import and use the compiled `app/styles/app.css` inside `app/root.jsx`:

```jsx
// app/root.jsx

import styles from "~/styles/app.css"

export function links() {
	return [{ rel: "stylesheet", href: styles }]
}
```

### Creating the header

`root.jsx` serves as the default layout which every page of our app will use and since the header will be the same across board, we are going to add the header directly inside `root.jsx`.

Update `root.jsx` as below:

```jsx
// app/root.jsx

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link
} from '@remix-run/react';
import styles from "~/styles/app.css"

export default function App() {
	return (
		<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width,initial-scale=1" />

			<Meta />
			<Links />
		</head>
		
		<body className="bg-gray-100">
			<header className="bg-orange-500 py-2">
				<div className="max-w-4xl mx-auto px-8">
					<h1 className="text-white text-lg font-semibold">
						<Link to="/">Hacker News</Link>
					</h1>
				</div>
			</header>
		
			<div className="mt-6 max-w-4xl mx-auto px-8">
				<div className="bg-white rounded-sm shadow-sm">
					<Outlet />
				</div>
			</div>
			
			<ScrollRestoration />
			<Scripts />
			
			{process.env.NODE_ENV === "development" && <LiveReload />}
		</body>
		</html>
	);
}
```

## Define the application routes

Remix uses a file-based routing system where files inside the `routes` directory are considered as routes. Remix also support nested routes by treating sub-directories within the `routes` directory as such. Also, we can define dynamic routes by prefixing them with `$`.

Consider the structure below which is what our routes directory will look like at the end of this section:

```bash
├── items
│   └── $id.jsx
└── index.jsx
```

`index.jsx` will serve as the homepage, that is, [localhost:3000](http://localhost:3000/), while `items/$id.jsx` handles requests from [localhost:3000/items/1234](http://localhost:3000/items/1234).

### List of items route

Now that we know how routing works in Remix, let’s define the routes for our application. Our Remix app already come with one of the routes we’ll be needing that is, `routes/index.jsx` which will serve as the homepage of our application and render a list of items, in our application's case: Hacker News top stories.

Open the `app/routes/index.jsx` file and update as below:

```jsx
// app/routes/index.jsx

export default function Index() {
	return (
		<div className="divide-y">
      {/* list of items will be rendered here */}
		</div>
	);
}
```

Within the `div` is where the list of items will be rendered, which we'll cover later.

### Single item route

The single item route will handle the `/items/{id}` URL. This is going to be a dynamic route such that requests from [localhost:3000/items/1234](http://localhost:3000/items/1234) will be handled by `/items/$id.jsx`.

Inside `app/routes`, create a `items` directory and inside of it, create a `$id.jsx` file and add the code below to it:

```jsx
// app/routes/items/$id.jsx

export default function ItemId() {
  return (
    <div className="flex items-center space-x-4 p-4">
      {/* single item and its comments will be rendered here */}
    </div>
  );
}
```

Within the `div` is where a single item and its comments will be rendered, which we'll cover later.

## Fetching data from the Hacker News API

As mentioned in the introduction, we will be fetching data from [Hacker News API](https://hacker-news.firebaseio.com/v0/) which the docs are available on [https://hackernews.api-docs.io/v0/live-data/ask-hn-stories](https://hackernews.api-docs.io/v0/live-data/ask-hn-stories).

**Fetch helper function**

To easily fetch data from the Hacker News API, we will create helper functions. The helper functions will be reused in a different part of the app to fetch data, it’s in charge of data fetching. In the `app` directory, create a new `helper` directory and create a new `fetch.js` file in it.

For now, we will create some variables that we will reuse later:

```jsx
// app/helper/fetch.js

const baseUrl = 'https://hacker-news.firebaseio.com/v0/';
const endpointSuffix = '.json';
```

- `baseUrl`: This is the base API URL.
- `endpointSuffix`: This is the ending of the API endpoint and it’s the file type to be fetched.

### Top stories

In the `fetch.js` file, create a `getTopStories` function that will fetch the IDs for top stories (items) from hacker news:

```jsx
// app/helper/fetch.js
    
export const getTopStories = async () => {
  const response = await fetch(`${baseUrl}topstories${endpointSuffix}`)

  return response.json()
}
```

### Single item

For a single item, let’s create a `getItem` function that will fetch an individual item. Within Hacker News, items' comments are basically nested items. Therefore, this function will also be used to fetch an item's comments:

```jsx
// app/helper/fetch.js

export const getItem = async (itemId) => {
  const response = await fetch(`${baseUrl}item/${itemId}${endpointSuffix}`)

  return response.json()
}
```

### User

Lastly, we'll create a `getUser` function that will be used to fetch the details of the user that created an item or commented on an item:

```jsx
// app/helper/fetch.js
    
export const getUser = async (userId) => {
  const response = await fetch(`${baseUrl}user/${userId}${endpointSuffix}`)

  return response.json()
}
```

## Build the components of our application

So far, we have the routes, functions to fetch data from the Hacker News API. Now, it’s time to glue everything together by creating components that will used to render the data. We need two components: `Item` and `Comment`.

### Item component

We'll start by creating a `components` directory inside the `app` directory then within the `components` directory, create an `Item.jsx` file that will display each individual item. The `Item` component will accept the item to display. Add the following code to it:

```jsx
// app/components/item.jsx
    
import { Link } from '@remix-run/react'

export default function Item({ item }) {
  return (
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
```

Here, we are basically display the item's details, specifically the id, title, URL, time, and descendants.

Now that we have the `Item` component, let’s update our `index.jsx` route to show a list of items.

Remix uses the concept of data loading for fetching data from an API or a server into components. So we are going to create a loaders to fetch data from the Hacker News API.

First, let’s fetch the top stories from the endpoint using the `getTopStories()` we created earlier. Add the code below inside `routes/index.jsx`:

```jsx
// app/routes/index.jsx

import { getTopStories, getItem } from '~/helper/fetch'

export const loader = async () => {
  const topStoryIds = await getTopStories()

  const items = await Promise.all(
    topStoryIds.slice(0, 10).map(async (itemId) => await getItem(itemId))
  )

  return items
}
```

Here, we create a `loader` function that uses the `getTopStories` function to fetch the top stories. The `/topstories` endpoint will return an array of item IDs. Since the `/topstories` endpoint will return up to 500 item IDs, we are using `slice()` to get only the first 30 amd we map through them passing each ID to the `getItem` function to fetch the item's details.

Next, let's add the portion to render the items:

```jsx
// app/routes/index.jsx

import { useLoaderData } from '@remix-run/react'
import Item from '~/components/Item'

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
```

Using `useLoaderData()` we get the items fetched earlier by `loader()`. Then we perform a simple check to only render the `Item` component when the array of items is not empty. Then we loop through each item passing it to the `Item` component.

We should now see a list of item displayed on the homepage as below:

![List of items](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7de6a473-4f99-4943-97a5-e5dcc0971a4e/Screenshot_2022-03-25_at_09-29-24_Remix_Hacker_News_Clone.png)

### Comment component

Let’s go ahead by creating the `Comment` component, which will be used to display an item’s comments. Create a new file `Comment.jsx` in the `components/` directory. The `Comment` component will accept a comment (item) and renders the comment details. Also, the `Comment` component checks if each comment has descendants and calls itself and renders till there is/are no nested descendants any more.

```jsx
// app/components/comment.jsx
    
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
```

Let's update `$id.jsx` to display a single item and its comments using the `Comment` component:

```jsx
// app/routes/items/$id.jsx

import { Link, useLoaderData } from '@remix-run/react'
import Comment from '~/components/Comment'
import { getItem } from '~/helper/fetch'

export const loader = async ({ params }) => {
  const item = await getItem(params.id)

  const comments = await Promise.all(
    item.kids.map(async (itemId) => await getItem(itemId))
  )

  return { item, comments }
}

export default function ItemId() {
  const { item, comments } = useLoaderData()

  return (
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
            {comments &&
              comments.map((comment) => (
                <Comment comment={comment} key={comment.id} />
              ))}
          </div>
        </>
      )}
    </div>
  )
}
```

First, we create a loader function that uses the `getItem()` to fetch a particular item. The function takes the ID of the item to fetch, which is gotten from the URL parameter. Also, we fetch the item's comments by looping throuh the item's descendants. Using `useLoaderData()` we get both the item and comments fetched by the `loader()`, then render the item's details as well as its comments. For the item's comments, we make use of the `Comment` component passing to it each comment.

![Single item and comments](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b6efc7d4-2e2b-4f42-9637-9e7bd89627f4/Screenshot_2022-03-25_at_09-38-27_Remix_Hacker_News_Clone.png)

## Deploy to Koyeb

Koyeb is a developer-friendly serverless platform to deploy apps globally. No-ops, servers, or infrastructure management and it has supports for different tech stacks such ass Rust, Golang, Python, PHP, Node.js, Ruby, and Docker.

2. On your [dashboard](https://app.koyeb.com/) click on the ****CREATE APP**** button to set up a new App.

![https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931227823_koyep1.PNG](https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931227823_koyep1.PNG)

3. If your code is not yet on GitHub, push your code to GitHub and connect your GitHub Account to Koyeb and select GitHub as the Deployment method.
To deploy on Koyeb, we need to create a new GitHub repository from the GitHub web interface or using the GitHub CLI with the following command:

![https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931286379_koyep2.PNG](https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931286379_koyep2.PNG)

4. Repository selection and App Configuration

1. Choose the git repository and select the right branch so you don’t have errors during app deployment.

2. Configure your application by adding a run and build commands

3. Select the Container Size, there are various to choose from, you can change it anytime.

4. Select your server region.

![https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931343985_koyep3.PNG](https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931343985_koyep3.PNG)

5. Select Ports, Environmental Variables, and App Name.

1. Select a `port`, `protocol`, and `path` you wish to run your app or just use the defaults if you don’t want to.

2. If you had set environmental variables, add them here before deployment.

3. Choose a name for your app.

4. Click on the **CREATE APP** to create your app

![https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931398655_koyep4.PNG](https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931398655_koyep4.PNG)

Viola! your app is being deployed, a public URL will be provided to view your App.

![https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931437254_koyep5.PNG](https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931437254_koyep5.PNG)

## Conclusion

In conclusion, Remix is a great framework with potential. It's an entirely new approach to building hybrid React web applications that are built upon the advancements we've seen in both modern and legacy web technologies over the years.
