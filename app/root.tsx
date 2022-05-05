import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { getUser } from "./auth.server";
import { LinkButton } from "./components/LinkButton";
import mainStylesheet from "./styles/base.css";
import fontStylesheet from "./styles/fonts.css";
import tailwindStylesheet from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: mainStylesheet },
    { rel: "stylesheet", href: fontStylesheet },
    { rel: "stylesheet", href: tailwindStylesheet },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "swolmodoro",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  // if (isProtectedRoute(request)) await requireUser(request);

  return json({});
};

export default function App() {
  return (
    <html lang="en" className="h-full bg-sand">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  return (
    <html lang="en" className="h-full bg-sand">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full space-y-8">
        <section className=" py-8 text-center">
          <h1 className="font-nunito text-6xl font-bold">Uh oh!</h1>
          <h3 className="text-xl text-gray-700">
            Looks like that page doesn't exist.
          </h3>
        </section>
        <section className="text-center">
          <LinkButton href="/start">Go To Start</LinkButton>
        </section>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
