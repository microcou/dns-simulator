import { ServerView } from "../views/ServerView";
import { NameView } from "../views/NameView";

export function HomePage() {
	return (
		<main>
			<h1>Home</h1>
			<div style={{ display: "flex", gap: "1rem" }}>
				<NameView />
				<ServerView />
			</div>
		</main>
	);
}
