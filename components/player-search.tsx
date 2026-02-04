"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Player } from "@/lib/definitions";
import Fuse from "fuse.js";
import * as React from "react";

interface PlayerSearchProps {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
  guessedPlayerIds: Set<number>;
}

export function PlayerSearch({
  players,
  onPlayerSelect,
  guessedPlayerIds,
}: PlayerSearchProps) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const fuse = React.useMemo(
    () =>
      new Fuse(players, {
        keys: ["name"],
        threshold: 0.4,
        distance: 100,
        minMatchCharLength: 1,
      }),
    [players],
  );

  const filteredPlayers = React.useMemo(
    () =>
      fuse
        .search(query)
        .slice(0, 5)
        .map((result) => result.item)
        .filter((player) => !guessedPlayerIds.has(player.id)),

    [query, fuse, guessedPlayerIds],
  );

  const handleSelect = React.useCallback(
    (player: Player) => {
      onPlayerSelect(player);
      setOpen(false);
    },
    [onPlayerSelect],
  );

  return (
    <Combobox
      open={open}
      onOpenChange={setOpen}
      onInputValueChange={setQuery}
      autoHighlight={true}
    >
      <ComboboxInput
        placeholder="Search for player by surname..."
        showTrigger={false}
        className="w-full max-w-md"
      />
      {query !== "" && (
        <ComboboxContent>
          <ComboboxList>
            {filteredPlayers.length <= 0 ? (
              <ComboboxEmpty>No players found</ComboboxEmpty>
            ) : (
              filteredPlayers.map((player) => (
                <ComboboxItem
                  key={player.id}
                  value={player.name}
                  onClick={() => handleSelect(player)}
                >
                  {player.name}
                </ComboboxItem>
              ))
            )}
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
}
