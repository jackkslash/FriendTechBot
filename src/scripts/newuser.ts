import { notableNames } from "./notableList";
import { fetchPlus } from "../util/fetchplus";
import { sleep } from "../util/utils";
import jsdom from "jsdom";
import config from "../config";
import { EmbedBuilder } from "discord.js";

export async function newUsers(client: any, userindex: number) {
  //NEWUSERSCHANNELID

  const newuserChannel = client.channels.cache.get(config.NEWUSERSCHANNELID);
  const newusernotableChannel = client.channels.cache.get(
    config.NEWUSERSNOTABLECHANNELID
  );

  const notableArray = notableNames;
  let userI: number = userindex;
  console.log(userI);
  while (true) {
    const data = await fetchPlus(
      "https://prod-api.kosetto.com/users/by-id/" + userI,
      {},
      100000
    );
    console.log(data);
    userI++;

    fetch("https://nitter.cz/" + data.twitterUsername)
      .then(function (response) {
        // When the page is loaded convert it to text
        return response.text();
      })
      .then(function (html) {
        const dom = new jsdom.JSDOM(html);
        const element =
          dom.window.document.getElementsByClassName("profile-stat-num");
        console.log("https://nitter.cz/" + data.twitterUsername);
        let twitterUserFollowCount: any;

        twitterUserFollowCount = element[2].innerHTML.replace(/\,/g, "");
        console.log(twitterUserFollowCount);

        let twName = data.twitterUsername.toLowerCase();
        let notable = false;
        console.log("current username " + twName);

        const embed = new EmbedBuilder()
          .setTitle(data.twitterUsername + " bought their own share")
          .setURL("https://www.friend.tech/rooms/" + data.address)
          .setThumbnail(data.twitterPfpUrl)
          .setTimestamp();

        embed.addFields(
          {
            name: "Twitter",
            value:
              "[ " +
              data.twitterUsername +
              " ](" +
              "https://twitter.com/" +
              data.twitterUsername +
              ")",
            inline: true,
          },
          {
            name: "Basescan",
            value:
              "[Link](" + "https://basescan.org/address/" + data.address + ")",
            inline: true,
          },
          {
            name: "Followers",
            value: twitterUserFollowCount,
            inline: true,
          }
        );

        if (notableArray.includes(twName)) {
          notable = true;
        }

        if (notable == true) {
          newusernotableChannel.send({
            content: "@everyone",
            embeds: [embed],
          });
        } else {
          newuserChannel.send({ embeds: [embed] });
        }
      })
      .catch(function (err) {
        console.log("Failed to fetch page: ", err);

        const embed = new EmbedBuilder()
          .setTitle(data.twitterUsername + " bought their own share")
          .setURL("https://www.friend.tech/rooms/" + data.address)
          .setThumbnail(data.twitterPfpUrl)
          .setTimestamp();

        embed.addFields(
          {
            name: "Twitter",
            value:
              "[ " +
              data.twitterUsername +
              " ](" +
              "https://twitter.com/" +
              data.twitterUsername +
              ")",
            inline: true,
          },
          {
            name: "Basescan",
            value:
              "[Link](" + "https://basescan.org/address/" + data.address + ")",
            inline: true,
          }
        );

        const tw = data.twitterUsername.toLowerCase();
        if (notableArray.includes(tw)) {
          newusernotableChannel.send({
            content: "@everyone",
            embeds: [embed],
          });
        } else {
          newuserChannel.send({ embeds: [embed] });
        }
      });
    await sleep(1500);
    console.log(userI);
  }
}
