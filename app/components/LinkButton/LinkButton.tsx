interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  target,
}) => {
  return (
    <a
      href={href}
      target={target}
      className="bg-tomato bg-opacity-5 px-3 py-2 text-tomato"
    >
      {children}
    </a>
  );
};
