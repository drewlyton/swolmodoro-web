import { Navbar } from "~/components/Navbar";
import type { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  return {};
};

export default function () {
  return (
    <>
      <Navbar />
      <main className="container my-0 mx-auto flex max-w-md flex-col items-center justify-center pt-8">
        <Outlet />
      </main>
    </>
  );
}
