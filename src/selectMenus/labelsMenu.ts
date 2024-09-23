import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Label } from "../classes/trello";

const labelsMenu = (
  menuId: string,
  labels: Label[]
): StringSelectMenuBuilder => {
  const _menu = new StringSelectMenuBuilder()
    .setCustomId(`${menuId}--labelsMenu`)
    .setOptions(
      labels.map((_label) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(_label.name)
          .setValue(_label.id)
      )
    );
  return _menu;
};
export { labelsMenu };
export default labelsMenu;
