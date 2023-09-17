import { ethers } from "ethers";
import jsdom from "jsdom";
import ft from "../abi/FT.json";
import { sleep } from "../util/utils";
import config from "../config";
import { notableNames } from "./notableList";
import { EmbedBuilder } from "discord.js";

export async function sharebuyzero(client: any) {
  // Configure the provider using an Ethereum node URL
  const provider = new ethers.providers.JsonRpcProvider(config.BASERPC);

  const zeroshare = client.channels.cache.get(config.ZEROSHARECHANNELID);
  const zeroshare10 = client.channels.cache.get(config.ZEROSHARE10CHANNELID);
  const zeroshare50 = client.channels.cache.get(config.ZEROSHARE50CHANNELID);
  const zeroshareNotable = client.channels.cache.get(
    config.ZEROSHARENOTABLECHANNELID
  );
  const contractABI = ft;
  const contractAddress = "0xcf205808ed36593aa40a44f10c7f7c2f67d4a4d4";
  console.log(contractABI);

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const notableArray = notableNames;

  contract.on(
    "Trade",
    async (
      from,
      to,
      value,
      event,
      ethAmount,
      shareAmount,
      supply,
      trader,
      subject
    ) => {
      try {
        if (
          ethAmount._hex == "0x00" &&
          subject.args.trader == subject.args.subject &&
          subject.args.supply.toNumber() == 1
        ) {
          //   console.log("trader: " + trader);
          //   console.log(subject.args.trader);
          //   console.log(subject.args.subject);
          //   console.log("eth: ", ethAmount._hex);
          //   console.log("eth: ", ethAmount);
          //   console.log("supply", subject.args.supply.toNumber());
          //   console.log("https://www.friend.tech/rooms/" + subject.args.subject);
          //   console.log(
          //     "https://prod-api.kosetto.com/users/" + subject.args.subject
          //   );
          await sleep(1500);
          const fetchPlus: any = (url: any, options = {}, retries: any) =>
            fetch(url, options)
              .then(async (res) => {
                if (res.ok) {
                  return res.json();
                }
                if (retries > 0) {
                  console.log("fetch retry " + retries + "url: " + url);
                  await sleep(1500);
                  return fetchPlus(url, options, retries - 1);
                }
              })
              .catch((error) => console.error(error.message));

          let data = await fetchPlus(
            "https://prod-api.kosetto.com/users/" + subject.args.subject,
            {},
            5
          );

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
                .setURL("https://www.friend.tech/rooms/" + to)
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
                  value: "[Link](" + "https://basescan.org/address/" + to + ")",
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

              if (
                Number(twitterUserFollowCount) >= 10000 &&
                Number(twitterUserFollowCount) < 50000 &&
                notable == false
              ) {
                zeroshare10.send({ embeds: [embed] });
              } else if (
                Number(twitterUserFollowCount) >= 50000 &&
                notable == false
              ) {
                zeroshare50.send({ embeds: [embed] });
              } else if (notable == true) {
                zeroshareNotable.send({
                  content: "@everyone",
                  embeds: [embed],
                });
              } else if (Number(twitterUserFollowCount) > 1) {
                zeroshare.send({ embeds: [embed] });
              } else {
                console.log("not enough followers");
              }
            })
            .catch(function (err) {
              console.log("Failed to fetch page: ", err);

              const embed = new EmbedBuilder()
                .setTitle(data.twitterUsername + " bought their own share")
                .setURL("https://www.friend.tech/rooms/" + to)
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
                  value: "[Link](" + "https://basescan.org/address/" + to + ")",
                  inline: true,
                }
              );

              const tw = data.twitterUsername.toLowerCase();
              if (notableArray.includes(tw)) {
                zeroshare.send({ content: "@everyone", embeds: [embed] });
              } else {
                zeroshare.send({ embeds: [embed] });
              }
            });
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
}
