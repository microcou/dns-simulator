import { useNameStore, useServerStore } from "../store";

export function ServerView() {
	return (
		<div>
			<h1>Server View</h1>
			<NameEditor />
			<ServerEditor />
		</div>
	);
}

function NameEditor() {
	const names = useNameStore((state) => state.names);
	const addName = useNameStore((state) => state.addName);
	const deleteName = useNameStore((state) => state.deleteName);

	return (
		<div>
			<h2>Name Editor</h2>
			{names.length === 0 ? (
				<p>No names available</p>
			) : (
				<ul>
					{names.map((name) => (
						<li key={name.id}>
							{name.name}
							<button type="button" onClick={() => deleteName(name.id)}>
								Delete
							</button>
						</li>
					))}
				</ul>
			)}

			<form
				onSubmit={(event) => {
					event.preventDefault();
					const form = event.currentTarget;
					const formData = new FormData(form);
					const value = formData.get("name");
					const name = typeof value === "string" ? value.trim() : "";
					if (name) {
						addName(name);
						form.reset();
					}
				}}
			>
				<input type="text" name="name" aria-label="Name" />
				<button type="submit">Add name</button>
			</form>
		</div>
	);
}

function ServerEditor() {
	const servers = useServerStore((state) => state.servers);
	const addServer = useServerStore((state) => state.addServer);
	const deleteServer = useServerStore((state) => state.deleteServer);

	return (
		<div>
			<h2>Server editor</h2>

			<ul>
				{servers.length === 0 ? (
					<p>No servers available</p>
				) : (
					servers.map((server) => (
						<li key={server.id}>
							{server.name} ({server.ip})
							<button type="button" onClick={() => deleteServer(server.id)}>
								Delete
							</button>
						</li>
					))
				)}
			</ul>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					const form = event.currentTarget;
					const formData = new FormData(form);
					const nameValue = formData.get("name");
					const ipValue = formData.get("ip");
					const name = typeof nameValue === "string" ? nameValue.trim() : "";
					const ip = typeof ipValue === "string" ? ipValue.trim() : "";
					if (name && ip) {
						addServer({ name, ip });
						form.reset();
						const nameInput = form.elements.namedItem("name");
						if (nameInput instanceof HTMLInputElement) {
							nameInput.focus();
						}
					}
				}}
			>
				<input type="text" name="name" aria-label="Server name" />
				<input type="text" name="ip" aria-label="Server IP" />
				<button type="submit">Add server</button>
			</form>
		</div>
	);
}
