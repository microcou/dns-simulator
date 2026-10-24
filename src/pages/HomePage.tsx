import { useState } from "react";
import { Link } from "wouter";

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Home</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
      </div>
      <Link href="/about">About</Link>
    </main>
  );
}
