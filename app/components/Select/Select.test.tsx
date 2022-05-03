import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

it("Select renders", () => {
  render(<Select></Select>);
  expect(screen.getByTestId("select")).toBeTruthy();
});
