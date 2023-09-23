import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "./../config";
import { ethers } from "ethers";

export const data = new SlashCommandBuilder()
  .setName("user")
  .setDescription("User infor on FT")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("Username on FT")
      .setRequired(true)
  );

export async function execute(interaction: any) {
  const username = interaction.options.getString("username");
  interaction.deferReply();

  const search = await fetch(
    "https://prod-api.kosetto.com/search/users?username=" + username,
    {
      headers: {
        Authorization: config.FTAUTHTOKEN,
      },
    }
  );

  const res = await search.json();

  console.log(res.users[0]);
  const find = await fetch(
    "https://prod-api.kosetto.com/users/" + res.users[0].address,
    {
      headers: {
        Authorization: config.FTAUTHTOKEN,
      },
    }
  );

  const findRes = await find.json();

  const points = await fetch(
    "https://prod-api.kosetto.com/points/" + res.users[0].address,
    {
      headers: {
        Authorization: config.FTAUTHTOKEN,
      },
    }
  );

  const pRes = await points.json();

  console.log(findRes);

  console.log(findRes.shareSupply);
  console.log(findRes.holderCount);
  console.log(findRes.holdingCount);
  console.log(findRes.displayPrice);
  const uHolders = findRes.holderCount / (findRes.shareSupply / 100);
  const time = Number(findRes.lastOnline) / 1000;
  const sharePrice = ethers.utils.formatEther(findRes.displayPrice);
  const embed = new EmbedBuilder().setTitle(findRes.twitterName + " stats.");

  embed.addFields(
    {
      name: "Price",
      value: "" + sharePrice,
      inline: true,
    },
    {
      name: "Circulating",
      value: "" + findRes.shareSupply,
      inline: true,
    },
    {
      name: "Holders",
      value: "" + findRes.holderCount,
      inline: true,
    },
    {
      name: "Last Online",
      value: "<t:" + Math.trunc(time) + ":R>",
      inline: true,
    },
    {
      name: "Points",
      value: "" + pRes.totalPoints,
      inline: true,
    },
    {
      name: "Tier",
      value: "" + pRes.tier,
      inline: true,
    },
    {
      name: "Leaderboard",
      value: "#" + pRes.leaderboard,
      inline: true,
    },
    {
      name: "Unique Holders",
      value: "% " + uHolders.toFixed(2),
      inline: true,
    },
    {
      name: "Links",
      value:
        "[Basescan](https://basescan.org/address/" +
        findRes.address +
        ") | [Room](https://www.friend.tech/rooms/" +
        findRes.address +
        ") | [Buy](https://friend-swap.vercel.app/?address=" +
        findRes.address +
        ") | [Twitter](https://https://twitter.com/" +
        findRes.twitterUsername +
        ")",
      inline: false,
    }
  );

  return interaction.editReply({ embeds: [embed] });
}
