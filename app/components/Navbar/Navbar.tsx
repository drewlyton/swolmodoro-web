import { NavLink } from "remix";

type Props = {};

export function navLinkStyles({ isActive }: { isActive: boolean }) {
  return isActive ? "text-tomato" : undefined;
}

export const Navbar: React.FC<Props> = () => {
  return (
    <nav className="flex w-full items-center bg-sand px-8 py-3 font-nunito">
      <div className="flex-grow-0">Logo</div>
      <div className="flex w-full flex-1 justify-end">
        <NavLink to={"/start"} className={navLinkStyles}>
          Start
        </NavLink>
      </div>
    </nav>
  );
};
