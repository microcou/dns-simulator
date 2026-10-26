import { createContext, useContext, useState } from "react";
import { useNameStore } from "../store";
import { generateId, unsafeHash } from "../utils";

const NameAsciiContext = createContext({
	showRecords: true,
	showFullName: true,
	colorSeed: generateId(8),
});

const domainNameTree = {
	name: ".",
	isZoneStart: true,
	children: [
		{ name: "com", isZoneStart: true },
		{
			name: "org",
			isZoneStart: true,
			children: [
				{
					name: "iut",
					isZoneStart: true,
					children: [
						{ name: "www" },
						{ name: "intranet" },
						{
							name: "rt",
							isZoneStart: true,
							children: [
								{ name: "www", records: [{ type: "A", value: "127.0.0.1" }] },
								{ name: "intranet" },
								{
									name: "tp1",
									isZoneStart: true,
									children: [{ name: "www" }, { name: "blog" }, { name: "mail" }],
								},
								{
									name: "tp2",
									isZoneStart: false,
									children: [{ name: "www" }, { name: "blog" }, { name: "mail" }],
								},
							],
						},
						{
							name: "blog",
							records: [
								{ type: "A", value: "127.0.0.1" },
								{ type: "AAAA", value: "::1" },
							],
						},
					],
				},
				{
					name: "uga",
					isZoneStart: true,
					children: [{ name: "www" }, { name: "blog" }, { name: "mx" }],
				},
				{
					name: "mit",
					isZoneStart: true,
					children: [{ name: "www" }, { name: "blog" }, { name: "mx" }],
				},
			],
		},
		{ name: "net", isZoneStart: true },
	],
};

type DomainNameNode = {
	name: string;
	isZoneStart?: boolean;
	children?: DomainNameNode[];
	records?: { type: string; value: string }[];
};

function sortChildren(children: DomainNameNode[]) {
	return [...children].sort(function (a, b) {
		if (a.isZoneStart && !b.isZoneStart) return 1;
		if (!a.isZoneStart && b.isZoneStart) return -1;

		// const aNumChildren = a.children ? a.children.length : 0;
		// const bNumChildren = b.children ? b.children.length : 0;

		// if (aNumChildren && !bNumChildren) return 1;
		// if (!aNumChildren && bNumChildren) return -1;

		return a.name.localeCompare(b.name);
	});
}

function addChildren(
	node: DomainNameNode,
	targetName: string,
	newChildren: DomainNameNode[],
): DomainNameNode {
	if (node.name === targetName) {
		return { ...node, children: [...(node.children ?? []), ...newChildren] };
	}
	return node.children
		? { ...node, children: node.children.map((c) => addChildren(c, targetName, newChildren)) }
		: node;
}

export function NameAsciiView() {
	const names = useNameStore((state) => state.names);

	const [showRecords, setShowRecords] = useState(true);
	const [showFullName, setShowFullName] = useState(true);
	const [colorSeed, setColorSeed] = useState(() => generateId(8));

	let level = 0;

	const tree = addChildren(
		domainNameTree,
		"net",
		names.map((name) => ({ name: name.name, isZoneStart: false })),
	);

	return (
		<NameAsciiContext.Provider value={{ showRecords, showFullName, colorSeed }}>
			<div>
				<div style={{ display: "flex", gap: "1em", alignItems: "center", marginBottom: "0.5em" }}>
					<label>
						<input
							type="checkbox"
							checked={showRecords}
							onChange={(e) => setShowRecords(e.target.checked)}
						/>{" "}
						Show records
					</label>
					<label>
						<input
							type="checkbox"
							checked={showFullName}
							onChange={(e) => setShowFullName(e.target.checked)}
						/>{" "}
						Show FQDN
					</label>
					<button type="button" onClick={() => setColorSeed(generateId(8))}>
						Change colors
					</button>
				</div>
				<div aria-label="Domain name tree" style={{ border: "1px solid black" }}>
					<DomainNameNode level={level} node={tree} parentZone="" parentDomainName="" />
				</div>
			</div>
		</NameAsciiContext.Provider>
	);
}

function domainNameToColor(str: string) {
	while (str.length < 10) str += str;
	const hash = unsafeHash(str);
	const hue = hash % 360;
	const saturation = 50 + (hash % 20);
	const lightness = 50 + (hash % 30);
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function DomainNameNode({
	node,
	level,
	parentZone,
	parentDomainName,
}: {
	node: DomainNameNode;
	level: number;
	parentZone: string;
	parentDomainName: string;
}) {
	const context = useContext(NameAsciiContext);
	const name = node.name;
	const children = sortChildren(node.children ?? []);
	const records = node.records ?? [];

	const color = domainNameToColor((node.isZoneStart ? node.name : parentZone) + context.colorSeed);

	const fullName = !parentDomainName
		? "."
		: parentDomainName == "."
			? name + "."
			: name + "." + parentDomainName;

	return (
		<div
			style={{
				backgroundColor: color,
				border: node.isZoneStart ? "1px solid black" : "none",
				margin: node.isZoneStart ? "-1px" : "0",
				paddingLeft: 20,
			}}
		>
			<div style={{ fontWeight: node.isZoneStart ? "bold" : "normal" }}>
				{context.showFullName ? fullName : name}
			</div>

			{context.showRecords && (
				<div>
					{records.map((record, index) => (
						<div
							key={index}
							style={{
								paddingLeft: 20,
								fontStyle: "italic",
								fontSize: "0.8em",
							}}
						>
							{record.type} {record.value}
						</div>
					))}
				</div>
			)}

			{children.map((child) => (
				<DomainNameNode
					key={child.name}
					node={child}
					level={level + 1}
					parentZone={child.isZoneStart ? child.name : parentZone}
					parentDomainName={fullName}
				/>
			))}
		</div>
	);
}
