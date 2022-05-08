import { NavLink, useLocation } from "@remix-run/react";
import favicon from "../../../public/favicon.png";
import { version } from "@/package.json";

type Props = {};

export function navLinkStyles({ isActive }: { isActive: boolean }) {
  return isActive ? "text-tomato" : undefined;
}

export const Navbar: React.FC<Props> = () => {
  const location = useLocation();
  return (
    <nav className="my-0 mx-auto w-full max-w-lg border-b-2 border-b-gray-200 bg-sand py-5 px-4 font-nunito">
      <div className="container mx-auto flex items-center">
        <div className="mr-2">
          <img src={favicon} width="30px" alt="Logo" />
        </div>
        <div className="flex-grow-0 font-nunito font-bold text-gray-600">
          <small className="text-gray-500">v{version}</small>
        </div>
        <div className="flex w-full flex-1 justify-end">
          {location.pathname !== "/start" && (
            <NavLink
              to={"/start"}
              className={[
                "rounded-md bg-tomato bg-opacity-10 px-5 py-2 text-sm lowercase text-tomato transition-all hover:bg-opacity-20",
                navLinkStyles,
              ].join(" ")}
              end
            >
              End
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};
