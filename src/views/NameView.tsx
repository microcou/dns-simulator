import { useNameStore } from "../store";

export function NameView() {
	const names = useNameStore((state) => state.names);
	const deleteName = useNameStore((state) => state.deleteName);

	return (
		<div>
			<h1>Name View</h1>
			{names.length === 0 ? (
				<li>No names available</li>
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
		</div>
	);
}
