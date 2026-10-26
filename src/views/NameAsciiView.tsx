import { unsafeHash } from "../utils";

const domainNameTree = {
	name: ". (root)",
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
	],
};

type DomainNameNode = {
	name: string;
	isZoneStart?: boolean;
	children?: DomainNameNode[];
	records?: { type: string; value: string }[];
};

function sortChildren(children: DomainNameNode[]) {
	return [...children].sort(
		(a, b) =>
			Number(Boolean(a.isZoneStart)) - Number(Boolean(b.isZoneStart)) ||
			a.name.localeCompare(b.name),
	);
}

export function NameAsciiView() {
	let level = 0;
	return (
		<div aria-label="Domain name tree" style={{ border: "1px solid black" }}>
			<Para level={level} node={domainNameTree} parentZone="" />
		</div>
	);
}

function stringToColor(str: string) {
	return `hsl(${unsafeHash(str) % 360}, 60%, 80%)`;
}

function Para({
	node,
	level,
	parentZone,
}: {
	node: DomainNameNode;
	level: number;
	parentZone: string;
}) {
	const name = node.name;
	const children = sortChildren(node.children ?? []);
	const records = node.records ?? [];

	const color = stringToColor(node.isZoneStart ? node.name : parentZone);

	return (
		<div style={{ paddingLeft: 20, backgroundColor: color }}>
			<div style={{ fontWeight: node.isZoneStart ? "bold" : "normal" }}>
				{name} {node.isZoneStart ? "(zone start)" : null}
			</div>

			<div>
				{records.map((record, index) => (
					<div key={index} style={{ paddingLeft: 20, color: "gray" }}>
						{record.type} {record.value}
					</div>
				))}
			</div>

			{children.map((child) => (
				<Para
					key={child.name}
					node={child}
					level={level + 1}
					parentZone={child.isZoneStart ? child.name : parentZone}
				/>
			))}
		</div>
	);
}
