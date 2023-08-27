//https://discordapi.com/permissions.html#84032
//https://discordapp.com/oauth2/authorize?&client_id=1115394855993090078&scope=bot&permissions=8

import { ApplicationCommandInteraction, Client, Intents, TextChannel, event, slash } from 'https://deno.land/x/harmony/mod.ts'
import { ApplicationCommandOptionType } from 'https://deno.land/x/harmony@v2.9.0/src/types/applicationCommand.ts';

const authText = await Deno.readTextFile("./auth.json");

interface AuthJson {
  token: string;
}
const authJson = JSON.parse(authText) as AuthJson;

// /swbf_notify_add_channel
// /swbf_notify_rm_channel
// /swbf_notify_clear_channels
// /swbf_notify_add_user
// /swbf_notify_rm_user
// /swbf_notify_server min (default 1)


class SlashCommandClient extends Client {
  @event()
  async ready () {
    const commands = await this.interactions.commands.all();
    if (commands.size < 3) {
      this.interactions.commands.bulkEdit([
        {
          name: "swbf_notify_server",
          description: "Configure notifications",
          options: [
            {
              name: "min",
              description: "min players must be joined to an swbf server before notification",
              required: true,
              type: ApplicationCommandOptionType.NUMBER
            }
          ]
        },
        {
          name: "swbf_notify_add_channel",
          description: "Add current channel to notifications"
        },
        {
          name: "swbf_notify_rm_channel",
          description: "Remove current channel from notificaitons"
        }
      ]);
    }
    console.log("discord bot connected");
  }
  @slash()
  swbf_notify_add_channel (d: ApplicationCommandInteraction) {
    //  d.channel.id
    d.reply(`Notifications for all scopes are now ENABLED in current channel`);
  }
  @slash()
  swbf_notify_rm_channel (d: ApplicationCommandInteraction) {
    //  d.channel.id
    d.reply(`Notifications for all scopes are now DISABLED in current channel`);
  }

  @slash()
  swbf_notify_server (d: ApplicationCommandInteraction) {
    const min = d.option<number>("min");
    d.reply(`Great, I'll notify you when at least ${min} players have joined a server!`);
  }
}

const client = new SlashCommandClient();

//General -> Read Messages / View Channels
//Text -> Send Messages
const intents = Intents.None;//[3072];//Intents.All;

client.connect(authJson.token, intents);
