import { Form, redirect } from "remix";
import type { ActionFunction } from "remix";
import { createSession } from "~/models/session.server";
import { getUserId } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const newSession = await createSession({
    name: "hello",
    userId: await getUserId(request),
  });

  return redirect(`/start/${newSession.id}/anotherone`);
};

export default function () {
  return (
    <div>
      <Form method="post">
        <select name="length">
          <option value={300}>5 minutes</option>
        </select>
        <button type="submit" name="create-session">
          Submit
        </button>
      </Form>
    </div>
  );
}
