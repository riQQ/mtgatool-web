import _ from "lodash";
import React from "react";
import { Column, FlexBottom, FlexTop, HoverTile, ListItem } from "./ListItem";
import css from "./ListItem.css";
import RankIcon from "../rank-icon";
import { DEFAULT_TILE } from "../../shared/constants";
import { ManaCost } from "../card-tile";
import CardTileCss from "../card-tile/CardTile.css";
import { utf8Decode } from "../../shared/util";
import { DeckLink } from "../metagame";
import MetaCss from "../metagame/metagame.css";
import Flex from "../flex";
import { getWinrateClass } from "../../shared/utils/getWinrateClass";
import formatPercent from "../../shared/utils/formatPercent";

interface ListItemMetagameDeckProps {
  decklink: DeckLink;
}

export default function ListItemMetagameDeck({
  decklink
}: ListItemMetagameDeckProps): JSX.Element {
  const wins = Math.round(decklink.wr * decklink.wrt);
  const losses = Math.round(decklink.wrt - decklink.wr * decklink.wrt);

  return (
    <ListItem click={(): void => {}}>
      <HoverTile grpId={decklink.tile || DEFAULT_TILE}>
        <RankIcon
          rank={decklink.rank}
          tier={decklink.tier}
          percentile={0}
          leaderboardPlace={0}
        />
      </HoverTile>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          flexGrow: 2
        }}
      >
        <Column>
          <FlexTop>
            <div className={css.listDeckName}>
              {utf8Decode(decklink.name) || ""}
            </div>
            <div className={css.listDeckNameIt}>
              {"by " + utf8Decode(decklink.owner) || ""}
            </div>
          </FlexTop>
          <FlexBottom>
            <ManaCost
              newclass={CardTileCss.manaS20}
              colors={decklink.colors || []}
            />
          </FlexBottom>
        </Column>

        <Column>
          <Flex className={MetaCss.deckLinkWr}>
            <>
              {wins}:{losses} (
              <span className={getWinrateClass(decklink.wr, true)}>
                {formatPercent(decklink.wr)}
              </span>
              )
            </>
          </Flex>
        </Column>
      </div>
    </ListItem>
  );
}
