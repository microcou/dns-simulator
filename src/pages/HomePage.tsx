import { ServerView } from "../views/ServerView";
import { NameView } from "../views/NameView";

export function HomePage() {
	return (
		<main>
			<h1>DNS Simulator</h1>
			<NameView />
			<ServerView />
		</main>
	);
}
