import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("chart")
  .setDescription("Charts for FT accounts by wallet address")
  .addStringOption((option) =>
    option
      .setName("wallet")
      .setDescription("Wallet Address of FT user")
      .setRequired(true)
  );

export async function execute(interaction: any) {
  const wallet = interaction.options.getString("wallet");

  return interaction.reply("chart");
}
