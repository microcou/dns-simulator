import { ServerView } from "../views/ServerView";
import { NameAsciiView } from "../views/NameAsciiView";
import { NameD3View } from "../views/NameD3View";

export function HomePage() {
	return (
		<main>
			<h1>DNS Simulator</h1>
			<div style={{ display: "flex", flexWrap: "wrap", gap: "1em", alignItems: "flex-start" }}>
				<div style={{ flex: "1 1 30em", minWidth: 0 }}>
					<NameAsciiView />
				</div>
				<div style={{ flex: "1 1 30em", minWidth: 0 }}>
					<ServerView />
				</div>
			</div>
			<NameD3View />
		</main>
	);
}
