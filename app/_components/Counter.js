// By default this would be a server component and hence cannot be included in any of the server components

"use client";
// By declaring this as use client we will now be able to use this component as a client component

import { useState } from "react";

export default function Counter({ users }) {
  const [count, setCount] = useState(0);

  console.log(users);

  return (
    <div>
      <p>there are {users.length} users.</p>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
    </div>
  );
}
