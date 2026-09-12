import Link from "next/link";
import { pokemonRoleById, type PokemonRoleId } from "@/content/pokemon-roles";

export function RoleTags({ roleIds }: { roleIds: PokemonRoleId[] }) {
  return <div className="flex flex-wrap gap-1.5">{roleIds.map((id) => {
    const role = pokemonRoleById.get(id);
    return role ? <Link key={id} href={`/pokemon-roles/#role-${id}`} className="rounded-full border border-blue-100 bg-white px-2.5 py-1 text-[10px] font-bold text-blue-700 hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600">{role.label}</Link> : null;
  })}</div>;
}
