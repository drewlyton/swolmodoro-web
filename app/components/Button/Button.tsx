import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  display?: "contained" | "outlined";
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * How large should the button be?
   */
  icon?: boolean;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  primary = true,
  size = "medium",
  display = "contained",
  children,
  className,
  icon = false,
  ...props
}) => {
  return (
    <button
      type="button"
      className={[
        display === "contained"
          ? "bg-tomato text-white"
          : "border-3 border-tomato text-tomato",
        !icon
          ? "rounded-md px-7 py-3 font-nunito font-bold"
          : "flex h-24 w-24 items-center justify-center rounded-full  text-2xl",
        "transition-all hover:opacity-80",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};
