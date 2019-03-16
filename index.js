const Discord = require('discord.js');
const bot = new Discord.Client();
const path = require('path');
const weather = require("weather-js");
const Wiki = require("wikijs");
const express = require("express");

bot.on('ready', function(){
	bot.user.setActivity('Jouer et apprendre en même temps').catch(console.error);
	bot.user.setUsername('FusionTrap BOT').catch(console.error);
	bot.user.setAvatar('./logoico2.png').catch(console.error);
})

bot.on('guildMemberAdd', member => {
	member.createDM().then(channel => {
		channel.send('Bienvenue sur le serveur DISCORD de FusionTrap' + member.displayName + '!')
	}).catch(console.error)
})

var messages = [];
bot.on('message', message => {
	if (message.content.startsWith('$admin')) {
		message.delete()
		message.reply('This functionnality is unavailable for the moment.')
	}
	else if (message.content.startsWith('$website')) {
		message.delete()
		message.reply('https://fusiontrap.000webhostapp.com')
	}
	else if (message.content.startsWith('$channel')) {
		message.delete()
		message.reply('This functionnality is unavailable for the moment.')
	}
	else if (message.content.startsWith('$youtube CocoMC98000')) {
		message.delete()
		message.reply('https://www.youtube.com/channel/UCrviJt5GHklB4H5D-X82Plw')
	}
	else if (message.content.startsWith('$youtube Bsx123')) {
		message.delete()
		message.reply('https://www.youtube.com/channel/UC_c_s2y5AQ5cT4Oi32icfbA')
	}
    else if (message.content.startsWith("$weather")){
    var location = message.content.substr(6);
    var unit = "C";
    
    try {
        weather.find({search: location, degreeType: unit}, function(err, data) {
            if(err) {
                message.reply("\n" + "I can't find the weather informations of " + location);
            } else {
                data = data[0];
                message.delete();
                message.reply("\n" + "**" + data.location.name + " Now : **\n" + data.current.temperature + "°" + unit + " " + data.current.skytext + ", feeling " + data.current.feelslike + "°, " + data.current.winddisplay + " Wind\n\n**Forecast for tomorrow :**\nHigh: " + data.forecast[1].high + "°, Low: " + data.forecast[1].low + "° " + data.forecast[1].skytextday + " with " + data.forecast[1].precip + "% of chance of rainfall");
            }
        });
    } catch(err) {
        console.log(Date.now(), "ERREUR", "Weather.JS a rencontré une erreur");
        message.reply("Weather.JS is actually down :(");
        }
    }
    else if (message.content.startsWith("$wiki")){
            if(!message.content.substr(5)) {
                message.reply("You should enter a term to search after the command");
                return;
            }
            var wiki = new Wiki.default();
            wiki.search(message.content.substr(5)).then(function(data) {
                if(data.results.length==0) {
			message.delete();
                    message.reply("I couldn't find a page about your search on Wikipedia :(");
                    return;
                }
                wiki.page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        if(summary.indexOf(" may refer to:") > -1 || summary.indexOf(" may stand for:") > -1) {
                            var options = summary.split("\n").slice(1);
                            var info = "Select a page from those :";
                            for(var i=0; i<options.length; i++) {
                                info += "\n\t" + i + ") " + options[i];
                            }
				message.delete();
                            message.reply(info);
                            selectMenu(message.channel, message.author.id, function(i) {
                                commands.wiki.process(Client, message, options[i].substring(0, options[i].indexOf(",")));
                            }, options.length-1);
                        } else {
                            var sumText = summary.split("\n");
                            var count = 0;
                            var continuation = function() {
                                var paragraph = sumText.shift();
                                if(paragraph && count<3) {
                                    count++;
					message.delete();
                                    message.reply(message.channel, paragraph, continuation);
                                }
                            };
				message.delete();
                            message.reply("**Found " + page.raw.fullurl + "**", continuation);
                        }
                    });
                });
            }, function(err) {
                message.reply("Uhhh...Something went wrong :(");
            });      
    }
})

bot.login(process.env.TOKEN);
