import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("Button renders", () => {
  render(<Button label="Hello" />);
  expect(screen.getByRole("button")).toBeValid();
});
