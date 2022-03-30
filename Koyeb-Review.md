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

At the prompt, choose **Just the basics** then **Remix App Server,** and then **JavaScript.** Finally, install the npm dependencies.

Once that’s done, you can change into the project directory and start the app:

```bash
cd remix-hacker-news
npm run dev
```

The app should be running on [localhost:3000](http://localhost:3000).

## Add Tailwind CSS to the App

For styling the app, we’ll be using Tailwind CSS, so let’s install and set it up:

```bash
npm install -D tailwindcss postcss autoprefixer concurrently
```

In addition to Tailwind and its peer dependencies, we are also installing `concurrently` which will be used to run multiple commands concurrently

Next, run the `init` command to create `tailwind.config.js`

```bash
npx tailwindcss init -p
```

Next, configure our template paths so as Tailwind CSS can know what to purge or not by updating the `content` section of `tailwind.config.js`:

```jsx
// tailwind.config.js

module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
	],
}
```

To compile the CSS, we need of new command. So update the `scripts` section in your `package.json` file to build both the development and production CSS as below:

```json
// package.json

"scripts": {
	"build": "npm run build:css && remix build",
	"build:css": "tailwindcss -m -i ./styles/app.css -o app/styles/app.css",
	"dev": "concurrently \\"npm run dev:css\\" \\"remix dev\\"",
	"dev:css": "tailwindcss -w -i ./styles/app.css -o app/styles/app.css",
}
```

Now, when we run `npm run dev`, Tailwind CSS will be compiled and saved inside `app/styles/app.css`.

Next, we need to make use of Tailwind directives in our CSS file. Create a `styles` directory in the root of the project and inside it create an `app.css` file and add the snippet below in it:

```css
/* styles/app.css */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

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
} from "remix";
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

Consider the structure below:

```bash
├── items
│   └── $id.jsx
└── index.jsx
```

`index.jsx` will serve as the homepage, that is, [localhost:3000](http://localhost:3000/), while `items/$id.jsx` handles requests from [localhost:3000/items/1234](http://localhost:3000/items/1234).

### List of items route

Now that we know how routing works in Remix, let’s define the routes for our application. Our Remix app already come with one of the routes we’ll be needing that is, `routes/index.jsx` which will serve as the homepage of our application and render a list of items.

Open the `app/routes/index.jsx` file and update as below:

```jsx
// app/routes/index.jsx

export default function Index() {
	return (
		<div className="divide-y">
			
		</div>
	);
}
```

This is where our list of items will be rendered when the data is fetched.

### Single item route

The single item route will handle the `/items/{id}` URL. This is going to be a dynamic route. That is, a request that comes like this [localhost:3000/items/1234](http://localhost:3000/items/1234) will be handled by `/items/$id.jsx`.

Inside `app/routes`, create a `items` directory and inside of it, create a `$id.jsx` file and add the code below to it:

```jsx
// app/routes/items/$id.jsx

export default function ItemId() {
  return (
    <div className="divide-y">
      <div className="flex items-center space-x-4 p-4">

      </div>
    </div>
  );
}
```

## Fetching data from the Hacker News API

As mentioned in the introduction, we will be fetching data from [Hacker News API](https://hacker-news.firebaseio.com/v0/) which the docs are available on [https://hackernews.api-docs.io/v0/live-data/ask-hn-stories](https://hackernews.api-docs.io/v0/live-data/ask-hn-stories).

**Fetch helper function**

To easily fetch data from the Hacker News API, we will create helper functions. The helper functions will be reused in a different part of the app to fetch data, it’s in charge of data fetching. In the `app` directory, create a new `helper` directory and create a new `fetch.js` file in it.

For now, we will create some variables that we will reuse later:

```jsx
// app/helper/fetch.js

const endpointPrefix = 'https://hacker-news.firebaseio.com/v0/';
const endpointSuffix = '.json';
```

- `endpointPrefix`: This is the beginning of the API endpoint, it is the main API URL.
- `endpointSuffix`: This is the ending of the API endpoint and it’s the file type to be fetched.

### List of items

In the `fetch.js` file, create a `getList` function that will fetch the list of items from hacker news:

```jsx
// app/helper/fetch.js
    
export const getList = async (list) => {
  if (list) {
    const endpoint = `${endpointPrefix}${list}${endpointSuffix}`;
    const res = await fetch(endpoint);
    const json = await res.json();

    return json;
  }

  return null;
};
```

### Single item

For the single item, let’s create a `getItem` function that will fetch an individual item:

```jsx
// app/helper/fetch.js

export const getItem = async (item) => {
  if (item) {
    const endpoint = `${endpointPrefix}item/${item}${endpointSuffix}`;
    const res = await fetch(endpoint);
    const json = await res.json();

    return json;
  }

  return null;
};
```

### Item comments

For the item comments, let’s create `getItemComments` function, this function will fetch the comments for our individual items.

```jsx
// app/helper/fetch.js
    
export const getItemComments = async (item) => {
  if (item) {
    const endpoint = `${endpointPrefix}item/${item}${endpointSuffix}`;
    const res = await fetch(endpoint);
    const json = await res.json();

    return json;
  }

  return null;
};
```

## Build the components of our application

So far, we have the routes, functions to fetch data from the Hacker News API. Now, it’s time to glue everything together by creating components that will used to render the data. We need two components: `Item` and `Comment`.

### Item component

Will start by create a `components` inside the `app` directory then within the `components` directory, create an `Item.jsx` file that will display each individual item. The `Item` component will accept the item’s ID and make use of the `getItem` function to fetch the item’s detail and stores it in the `item` state to be used to populate the item.

The loading state is created in case of data not being available before render, we use the loading state to determine when the data is not yet available and render a loading text or you can use a spinner or a skeleton.

```jsx
// app/components/item.jsx
    
import { Link } from 'remix';
import { useEffect, useState } from 'react'
import { getItem } from '~/helper/fetch';

export default function Item({ item: itemId }) {
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItem(itemId).then((result) => {
            setItem(result);
            setLoading(false);
        });
    }, []);

...
```

Let’s populate the data gotten from the API. The API carries different data but we will be using some of them, like the id, title, URL, time, and descendants.

```jsx
// app/components/item.jsx
    
...
    return (
        <div className="flex items-center space-x-4 p-4">
            {loading && <h3>Loading...</h3>}
            {
                !loading && item &&
                <>
                    <div className="text-orange-500 font-medium self-start place-self-start ">{item.score}</div>
                    <div>
                        <h3 className="text-gray-700">
                            <a href={item.url}>{item.title}</a>
                            <span className="pl-1 text-sm text-gray-400">(jvns.ca)</span>
                        </h3>

                        <div className="flex space-x-1.5 text-xs text-gray-500">
                            <span>
                                by <Link className="hover:underline" to="/">{item.by}</Link>
                            </span>
                            <span>{item.time}</span>
                            <Link className="hover:underline" to={`/items/${item.id}`}>{item.descendants} comments</Link>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
```

Now that we have the Item component, let’s update our `index.jsx` routes to show a list of items.

First let’s fetch a list of Items from the endpoint using the `getList()` helper function we created earlier, to get a list of items we have to pass in a type of list that should be returned, for this we will be fetching the top stories. let’s import `getList` from `helper/fetch.js` and in the loader function let’s fetch the list and return the response which is a list of top stories in an array of ids.

```jsx
// app/routes/index.jsx

import { json, useLoaderData } from 'remix'
import Item from '~/components/Item'
import { getList } from '~/helper/fetch'

export const loader = async () => {
  const res = await getList("topstories");
        
  return res;
}

...
```

Let’s use the loaded data to populate the list.

Using `useLoaderData()` function we can get the list fetched earlier by the `loader` function.

We have to do some checking if the number of items returned is greater than zero meaning to check if it’s empty.

Let’s go ahead and map through the list of items, here using the array slice function I’m limiting the list of items to be 30 since the endpoint returns more than that.

```jsx
// app/routes/index.jsx
...

export default function Index() {
  const items = useLoaderData()

  return (
    <div className="divide-y">

      {
        items.length>0 && items.slice(0,30).map((itemId)=>{
          return(
            <Item item={itemId} key={itemId}/>
          )
        })
      }
    </div>
  );
}
```

Here, we map through the list of items and render the `Item` component.

![List of items](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7de6a473-4f99-4943-97a5-e5dcc0971a4e/Screenshot_2022-03-25_at_09-29-24_Remix_Hacker_News_Clone.png)

List of items

### Comment component

Let’s go ahead by creating the `Comment` component, which will be used to display an item’s comments. Create a new file `Comment.jsx` in the `components/` directory.

The `Comment` component will accept an item and fetches its comment’s details using the `getItemComments` function and renders the comment details. Also, the `Comment` component checks if each comment has descendants and calls itself and renders till there is/are no nested descendants any more.

```jsx
//app/components/comment.jsx
    
import { Link } from 'remix';
import { useEffect, useState } from 'react'
import { getItem } from '~/helper/fetch';

export default function Item({item:itemId}) {
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItem(itemId).then((result) => {
            setItem(result);
            setLoading(false);
        });
    }, []);

    return (
        <div className="flex items-center space-x-4 p-4">
            {loading && <h3>Loading...</h3>}
            {
                !loading && item &&
                <>
                    <div className="text-orange-500 font-medium self-start place-self-start ">{item.score}</div>
                    <div>
                        <h3 className="text-gray-700">
                            {/* <Link to={`${item.url}`}>{item.title}</Link> */}
                            <a href={item.url}>{item.title}</a>
                            <span className="pl-1 text-sm text-gray-400">(jvns.ca)</span>
                        </h3>
                        
                        <div className="flex space-x-1.5 text-xs text-gray-500">
                            <span>
                                by <Link className="hover:underline" to="/">{item.by}</Link>
                            </span>
                            <span>{item.time}</span>
                            <Link className="hover:underline" to={`/items/${item.id}`}>{item.descendants} comments</Link>
                        </div>
 
                    </div>
                </>

            }
        </div >
    );
}
```

![Single item and comments](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b6efc7d4-2e2b-4f42-9637-9e7bd89627f4/Screenshot_2022-03-25_at_09-38-27_Remix_Hacker_News_Clone.png)

Single item and comments

## Deploy to Koyeb

Koyeb is a developer-friendly serverless platform to deploy apps globally. No-ops, servers, or infrastructure management and it has supports for different tech stacks such ass Rust, Golang, Python, PHP, Node.js, Ruby, and Docker.

If you are new to Koyeb platform follow these steps to get your account up and your project up running.

1. Signup for free on [https://www.koyeb.com](https://www.koyeb.com)

- You can sign up with your GitHub Account
- Or manually signup with your full name, email, and password

![https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931210048_koyep.PNG](https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931210048_koyep.PNG)

2. On your [dashboard](https://app.koyeb.com/) click on the ****CREATE APP**** button to set up a new App.

![https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931227823_koyep1.PNG](https://paper-attachments.dropbox.com/s_075E46BA182545ABCEC9324A9923BB0DBE250BD9ED7C637841114A94CF2C1058_1647931227823_koyep1.PNG)

3. If your code is not yet on GitHub, push your code to GitHub and connect your GitHub Account to Koyeb and select GitHub as the Deployment method.

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
