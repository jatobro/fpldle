"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Guess, Player } from "@/lib/definitions";
import Fuse from "fuse.js";
import * as React from "react";

interface PlayerSearchProps {
  players: Player[];
  guesses: Guess[];
  onPlayerSelect: (player: Player) => void;
}

export const PlayerSearch = ({
  players,
  guesses,
  onPlayerSelect,
}: PlayerSearchProps) => {
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

  const guessedPlayerIds = React.useMemo(
    () => new Set(guesses.map((guess) => guess.player.id)),
    [guesses],
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
    <Combobox open={open} onOpenChange={setOpen} onInputValueChange={setQuery}>
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
                  <span className="flex items-center justify-between w-full gap-2">
                    <span>{player.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {player.team}
                    </span>
                  </span>
                </ComboboxItem>
              ))
            )}
          </ComboboxList>
        </ComboboxContent>
      )}
    </Combobox>
  );
};
