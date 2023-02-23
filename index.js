require('dotenv').config();
const APPLICATION_ID = process.env.APPLICATION_ID ;
const TOKEN = process.env.TOKEN ;
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set';
const GUILD_ID = process.env.GUILD_ID ;


const axios = require('axios');
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');

const app = express();

const discord_api = axios.create({
	baseURL: 'https://discord.com/api/',
	timeout: 3000,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
		"Access-Control-Allow-Headers": "Authorization",
		"Authorization": `Bot ${TOKEN}`
	}
});




app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
	const interaction = req.body;

	if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		console.log(interaction.data.name);
		if (interaction.data.name === 'color' && interaction.data.options && interaction.data.options[0]?.name === 'hex') {
			let color = interaction.data.options[0].value.replace('#', '');
			console.log(interaction.data.options.hex);
			
			if (!color.match(/^[0-9a-fA-F]{6}$/)) {
				return res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: 'Invalid HEX color, please use format: **`#FFFFFF`**',
					},
				});
    			}
			
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: `This command is not yet functional!`,
				},
			});
		}
	}
});



app.get('/register_commands', async (req, res) =>{
	let slash_commands = [
		{
			name: 'color',
			description: 'Change the color of your username',
			options: [{
				name: 'hex',
				description: 'The hex code of the color you want to use',
				type: 3,
				required: true
			}]
		}
	];
	try {
		let discord_response = await discord_api.put(
			`/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
			slash_commands
		);
		console.log(discord_response.data);
		return res.send('commands have been registered');
	} catch (e) {
		console.error(e.code);
		console.error(e.response?.data);
		return res.send(`${e.code} error from discord`);
	}
});


app.get('/', async (req, res) => {
  return res.send('Follow documentation ');
});


app.listen(8999, () => {

});

