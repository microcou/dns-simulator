import { customAlphabet } from "nanoid";
import { nolookalikesSafe } from "nanoid-dictionary";

const generateIdWithCustomAlphabet = customAlphabet(nolookalikesSafe);

export function generateId(length: number): string {
	if (!Number.isSafeInteger(length) || length < 1 || length > 256) {
		throw new RangeError("ID length must be between 1 and 256");
	}

	return generateIdWithCustomAlphabet(length);
}

export function unsafeHash(str: string): number {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
