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
}

export function PlayerSearch({ players, onPlayerSelect }: PlayerSearchProps) {
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

  const filteredPlayers = React.useMemo(() => {
    if (!query) return players.slice(0, 5);
    const results = fuse.search(query);
    return results.slice(0, 5).map((result) => result.item);
  }, [query, fuse, players]);

  const handleSelect = React.useCallback(
    (player: Player) => {
      onPlayerSelect(player);
      setOpen(false);
    },
    [onPlayerSelect],
  );

  return (
    <div className="flex justify-center w-full">
      <Combobox
        open={open}
        onOpenChange={setOpen}
        onInputValueChange={setQuery}
      >
        <ComboboxInput
          placeholder="Search for a player..."
          showTrigger={false}
          className="w-full max-w-md"
        />
        <ComboboxContent>
          <ComboboxList>
            {filteredPlayers.length === 0 ? (
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
      </Combobox>
    </div>
  );
}
