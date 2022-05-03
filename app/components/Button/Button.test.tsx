import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("Button renders", () => {
  render(<Button>Hello</Button>);
  expect(screen.getByRole("button")).toBeValid();
});
