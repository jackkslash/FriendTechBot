import axios from "axios";
import { notableNames } from "./notableList";

function post(ws: any, m: any) {
  axios
    .post(ws, m)
    .then((response) => {
      console.log("Message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending message");
    });
}

async function check() {
  const notableArray = notableNames;
  let userindex = 1;
  while (true) {
    try {
      const req = await fetch(
        "https://prod-api.kosetto.com/users/by-id/" + userindex
      );
      const res = await req.json();

      if (!res.message) {
        let tw = res.twitterUsername;
        let message;
        if (notableArray.includes(tw)) {
          message = {
            content:
              "https://www.friend.tech/rooms/" +
              res.address +
              "\n https://basescan.org/address/" +
              res.address +
              "\n https://twitter.com/" +
              res.twitterUsername +
              "\n @everyone notable name signed up",
            allowed_mentions: { parse: ["everyone"] },
          };
        } else {
          message = {
            content:
              "https://www.friend.tech/rooms/" +
              res.address +
              "\n https://basescan.org/address/" +
              res.address +
              "\n https://twitter.com/" +
              res.twitterUsername,
          };
        }

        post(process.env.WBNU, message);
        userindex++;
      }
      while (res.message) {
        console.log("trying again");
        const req = await fetch(
          "https://prod-api.kosetto.com/users/by-id/" + userindex
        );
        const res = await req.json();
        console.log(res);

        if (!res.message) {
          let tw = res.twitterUsername;
          let message;
          if (notableNames.includes(tw)) {
            message = {
              content:
                "https://www.friend.tech/rooms/" +
                res.address +
                "\n https://basescan.org/address/" +
                res.address +
                "\n https://twitter.com/" +
                res.twitterUsername +
                " User Number: " +
                userindex +
                "\n @everyone notable name signed up",
              allowed_mentions: { parse: ["everyone"] },
            };
          } else {
            message = {
              content:
                "https://www.friend.tech/rooms/" +
                res.address +
                "\n https://basescan.org/address/" +
                res.address +
                "\n https://twitter.com/" +
                res.twitterUsername +
                " User Number: " +
                userindex,
            };
          }

          post(process.env.WBNU, message);
          userindex++;
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      await new Promise((r) => setTimeout(r, 5000));
    }

    await new Promise((r) => setTimeout(r, 1000));
  }
}

check();
