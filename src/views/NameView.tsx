import { useNameStore } from "../store";
import Tree from "react-d3-tree";

export function NameView() {
	const names = useNameStore((state) => state.names);
	const deleteName = useNameStore((state) => state.deleteName);

	const domainNameTree = {
		name: ". (root)",
		children: [
			{ name: "com" },
			{ name: "org" },
			{
				name: "net",
				children: names.map((name) => ({
					name: name.name,
					attributes: { id: name.id },
				})),
			},
		],
	};

	return (
		<div id="treeWrapper" style={{ width: "50em", height: "40em", border: "1px solid black" }}>
			<Tree
				data={domainNameTree}
				onNodeClick={(node) => {
					const nameId = node.data.attributes?.id;
					if (typeof nameId === "string") {
						deleteName(nameId);
					}
				}}
			/>
		</div>
	);
}
