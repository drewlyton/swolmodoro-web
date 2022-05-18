import { Button } from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  component: Button,
  title: "Button",
};

export const Primary = () => <Button>Hello</Button>;

export const Disabled = () => <Button disabled={true}>Hello</Button>;
