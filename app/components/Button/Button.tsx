import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  display?: "contained" | "normal";
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
  primary = false,
  size = "medium",
  display = "normal",
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={[
        "rounded-md bg-tomato px-7 py-3 font-nunito font-bold text-white transition-all hover:opacity-80",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};
