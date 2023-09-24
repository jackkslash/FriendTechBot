import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "./../config";
const puppeteer = require("puppeteer");
const imgbbUploader = require("imgbb-uploader");
const fs = require("fs");

export const data = new SlashCommandBuilder()
  .setName("chart")
  .setDescription("Charts for FT accounts by wallet address")
  .addStringOption((option) =>
    option
      .setName("user")
      .setDescription("Wallet Address or username of FT user")
      .setRequired(true)
  );

export async function execute(interaction: any) {
  let wallet: any = null;
  const user = interaction.options.getString("user");
  interaction.deferReply();

  if (user.split(0, 2) == "0x") {
    wallet = user;
  } else {
    const search = await fetch(
      "https://prod-api.kosetto.com/search/users?username=" + user,
      {
        headers: {
          Authorization: config.FTAUTHTOKEN,
        },
      }
    );
    const res = await search.json();
    console.log(res.users[0]);
    wallet = res.users[0];
  }

  const browser = await puppeteer.launch();

  // Create a new page/tab
  const page = await browser.newPage();

  // Navigate to a website
  await page.goto("https://friendmex.com/?address=" + wallet);

  // Define the custom clip area for the screenshot
  const clip = {
    x: 0, // X-coordinate of the top-left corner of the clip area
    y: 75, // Y-coordinate of the top-left corner of the clip area
    width: 800, // Width of the clip area
    height: 490, // Height of the clip area
  };

  // Capture a screenshot of the specified clip area
  await new Promise((r) => setTimeout(r, 2500));
  const screenshotPath = "./src/charts/" + wallet + ".png";
  await page.screenshot({ path: screenshotPath, clip });

  // Close the browser
  await browser.close();

  const apiKey = config.IMGAPI;

  /* or use import in ESM projects:
  import { imgbbUploader } from "imgbb-uploader"; 
  */

  imgbbUploader(apiKey, screenshotPath)
    .then(async (response: any) => {
      console.log(response.url);
      const req = await fetch("https://prod-api.kosetto.com/users/" + wallet);
      const res = await req.json();

      console.log(res.twitterName);

      console.log(`Screenshot saved as ${screenshotPath}`);
      fs.unlink(screenshotPath, function (err: any) {
        if (err) {
          throw err;
        } else {
          console.log("Successfully deleted the file.");
        }
      });
      const Embed = new EmbedBuilder()
        .setTitle("Chart of " + res.twitterName)
        .setImage(response.url);

      return interaction.editReply({ embeds: [Embed] });
    })
    .catch((error: any) => console.error(error));
}
