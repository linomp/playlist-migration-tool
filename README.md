# spotify-to-yt-playlist-migration-tool

## About

I love creating playlists on spotify but some of the best [Black Metal out there](https://youtu.be/ORzXJs7bhZ4?si=MKr7IMcbjyGO4xbq) is on youtube/bandcamp only... 

I found some online solutions for syncing playlists across services, but they mostly require you to sign up, pay, etc...

So I made this:

<img src="https://github.com/linomp/spotify-to-yt-playlist-migration/assets/40581019/12bf1655-4ad9-4c32-a101-6aacf7905678" width="100%"/>

This tool facilitates the process of copying the songs from a spotify playlist to a youtube playlist (and any artist + song that you enter in the columns actually...). 

Then you can go crazy and add all the underground shit you want!

## Requirements
- Spotify account (not necessarily Premium)
- Spotify API keys ([instructions here](https://developer.spotify.com/documentation/web-api/concepts/apps))

  _Note: as long as you don't exaggerate, the queries made by this tool should fall under the free Spotify API usage tier..._
- Google account

  _Note: there is no Youtube API key required; it just asks your authorization when running the code, since you will be manipulating your playlists_
  
## Setup
- The simplest way to get started is to make a copy of the [Pre-configured document](https://docs.google.com/spreadsheets/d/1TnVimrELombuuXrqrq-q2jsN9s5oolMulb7l59rpmu8/copy).
   <details>
     
   <summary>(optional): double-check the configuration</summary> 
   
   - Navigate here:
      
        <img src="https://github.com/linomp/spotify-to-yt-playlist-migration/assets/40581019/6ad904e0-3127-4026-9773-47939d8fafa6" width="20%"/>
        
   - And check that the `utils.gs` script is present, and the Youtube Data service is enabled:
      
        <img src="https://github.com/linomp/spotify-to-yt-playlist-migration/assets/40581019/7dc64945-d49a-4461-9db9-c3f7c89a4259" width="50%"/>
    </details>
  
- Get your Spotify API client ID and client secret by creating an App in the [Spotify Dev dashboard](https://developer.spotify.com/documentation/web-api/concepts/apps)

- Start using it!

  Set up the URLS, click on `Import Songs from Spotify`, and if you are satisfied with the result, start the migration with `Populate Youtube Playlist`.
 
  _Note: Google will ask you for authorization for running the code and for manipulating playlists with your Youtube account._

## Resources
- [Add a button on a sheet to run a Google Sheets script](https://www.benlcollins.com/apps-script/google-sheets-button/)
- [Get client ID and client secret in spotify dev dashboard](https://developer.spotify.com/documentation/web-api/concepts/apps)
- [Spotify API Explorer](https://developer.spotify.com/console/get-playlist-tracks/)
