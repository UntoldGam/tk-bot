import { Label, Trello } from "../classes/trello";

const tkBoardId = "61a666895ccfec22dc348e9f";
const eventsListId = "65e8a5ca6f79a51b7c81a5f3";
let trello: Trello;

const init = async () => {
  trello = new Trello({
    listId: eventsListId,
  });
  console.log("Trello setup started");
  await trello.getBoard(tkBoardId);
  console.log("Trello setup complete");
};
export { trello };
export default init;
/*
{
        "id": "61a666895ccfec22dc348e9f",
        "name": "[EO] History of the Air Nation",
        "desc": "A record of the history, and key information regarding the Air Nation of RoBending.\nTo gain access to the Board, you must be an Ascetic or Higher within the Temple Keepers.\nFor more information, contact untoldgam.",
        "idOrganization": "60ba601c06a5c31216ec3501",
        "starred": true,
        "url": "https://trello.com/b/47PPkbjV/eo-history-of-the-air-nation",
        "prefs": {
            "permissionLevel": "public",
            "hideVotes": false,
            "voting": "disabled",
            "comments": "org",
            "invitations": "admins",
            "selfJoin": true,
            "cardCovers": true,
            "cardCounts": false,
            "isTemplate": false,
            "cardAging": "regular",
            "calendarFeedEnabled": false,
            "hiddenPluginBoardButtons": [],
            "switcherViews": [
                {
                    "viewType": "Board",
                    "enabled": true
                },
                {
                    "viewType": "Table",
                    "enabled": true
                },
                {
                    "viewType": "Calendar",
                    "enabled": false
                },
                {
                    "viewType": "Dashboard",
                    "enabled": false
                },
                {
                    "viewType": "Timeline",
                    "enabled": false
                },
                {
                    "viewType": "Map",
                    "enabled": false
                }
            ],
            
        },
        "shortLink": "47PPkbjV",
        "subscribed": true,
        "labelNames": {
            "green": "Promotions",
            "yellow": "Event Result",
            "orange": "Keeper Demotions",
            "red": "Demotions",
            "purple": "",
            "blue": "",
            "sky": "",
            "lime": "",
            "pink": "",
            "black": "",
            "green_dark": "Retirements",
            "yellow_dark": "",
            "orange_dark": "",
            "red_dark": "",
            "purple_dark": "",
            "blue_dark": "Nation Setup",
            "sky_dark": "Information",
            "lime_dark": "",
            "pink_dark": "In Progress",
            "black_dark": "",
            "green_light": "Air Guru Changes",
            "yellow_light": "Event Announcement",
            "orange_light": "Keeper Promotions",
            "red_light": "",
            "purple_light": "",
            "blue_light": "",
            "sky_light": "",
            "lime_light": "",
            "pink_light": "",
            "black_light": ""
        },
        "powerUps": [],
        "dateLastActivity": "2024-07-05T16:40:19.503Z",
        "dateLastView": "2024-08-03T14:05:01.883Z",
        "shortUrl": "https://trello.com/b/47PPkbjV",
        "idTags": [],
        "datePluginDisable": null,
        "creationMethod": null,
        "ixUpdate": "3964",
        "templateGallery": null,
        "enterpriseOwned": false,
        "idBoardSource": null,
        "idMemberCreator": "5f482b596798f274e04c36d4",
        "type": null,
        "memberships": [
            {
                "id": "61a666895ccfec22dc348ea1",
                "idMember": "5f482b596798f274e04c36d4",
                "memberType": "admin",
                "unconfirmed": false,
                "deactivated": false
            }
        ]
    },
*/
