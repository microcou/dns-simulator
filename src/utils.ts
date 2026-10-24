import { customAlphabet } from "nanoid";
import { nolookalikesSafe } from "nanoid-dictionary";

const generateIdWithCustomAlphabet = customAlphabet(nolookalikesSafe);

export function generateId(length: number): string {
	if (!Number.isSafeInteger(length) || length < 1 || length > 256) {
		throw new RangeError("ID length must be between 1 and 256");
	}

	return generateIdWithCustomAlphabet(length);
}
