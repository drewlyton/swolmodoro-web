import { NavLink, useLocation } from "remix";
import { Logo } from "../Logo";

type Props = {};

export function navLinkStyles({ isActive }: { isActive: boolean }) {
  return isActive ? "text-tomato" : undefined;
}

export const Navbar: React.FC<Props> = () => {
  const location = useLocation();
  return (
    <nav className="my-0 mx-auto w-full max-w-lg border-b-2 border-b-gray-200 bg-sand py-5 font-nunito">
      <div className="container mx-auto flex items-center">
        <div className="flex-grow-0 font-nunito font-bold text-gray-600">
          swolmodoro
        </div>
        <div className="flex w-full flex-1 justify-end">
          {location.pathname !== "/start" && (
            <NavLink to={"/start"} className={navLinkStyles} end>
              Quit
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};
