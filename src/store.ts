import { create } from "zustand";
import type { Name, Server } from "./model";
import { generateId } from "./utils";

interface NameStore {
	names: Name[];
	addName: (name: string) => void;
	deleteName: (id: string) => void;
}

interface ServerStore {
	servers: Server[];
	addServer: (server: Omit<Server, "id">) => void;
	deleteServer: (id: string) => void;
}

export const useNameStore = create<NameStore>((set) => ({
	names: [],
	addName: (name) =>
		set((state) => ({
			names: state.names.concat({ id: generateId(32), name }),
		})),
	deleteName: (id) =>
		set((state) => ({
			names: state.names.filter((name) => name.id !== id),
		})),
}));

export const useServerStore = create<ServerStore>((set) => ({
	servers: [],
	addServer: (server) =>
		set((state) => ({
			servers: state.servers.concat({ ...server, id: generateId(32) }),
		})),
	deleteServer: (id) =>
		set((state) => ({
			servers: state.servers.filter((server) => server.id !== id),
		})),
}));
