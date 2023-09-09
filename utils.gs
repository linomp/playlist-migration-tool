/*

Resources:

- [Add a button on the sheet to run this script](https://www.benlcollins.com/apps-script/google-sheets-button/)
- [Get client ID and client secret by creating an app in spotify dev dashboard](https://developer.spotify.com/dashboard/applications)
- [Spotify API Explorer](https://developer.spotify.com/console/get-playlist-tracks/)

*/

var spotifyPlaylistUrl;
var spotifyClientId;
var spotifyClientSecret;

var youtubePlaylistUrl;

function importPlaylistContent(){  
  spotifyPlaylistUrl = getCellText(5, 6); // hardcoded location in sheet: F5
  playlistMarket = getCellText(6, 6); // hardcoded location in sheet: F6
  spotifyClientId = getCellText(7, 6); // hardcoded location in sheet: F7
  spotifyClientSecret = getCellText(8, 6); // hardcoded location in sheet: F8

  const playlistId = parseSpotifyPlaylistId(spotifyPlaylistUrl);
  const token = getToken();
  const songs = getSongs(token, playlistId, playlistMarket);
  const flattenedSongs = songs.map(song => ({"ARTIST": song.track.artists[0].name , "TRACK": song.track.name}))
  writeSongstoSheet(['ARTIST', 'TRACK'], flattenedSongs);
}

function getCellText(row, col) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cellValue = sheet.getRange(row, col).getValue();
  return cellValue.toString();
}


function parseSpotifyPlaylistId(url) {
  var regex = /playlist\/(\w+)/;
  var match = url.match(regex);
  
  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error('Invalid Spotify playlist URL');
  }
}

const getToken = function () {
  const authorization = "Basic "+ Utilities.base64Encode(`${spotifyClientId}:${spotifyClientSecret}`);
  const fetchParams = {
    method: 'post',
    payload: {'grant_type': 'client_credentials'},
    headers: {'Authorization': authorization},
    muteHttpExceptions: true
  }
  const replaceResponse = UrlFetchApp.fetch("https://accounts.spotify.com/api/token", fetchParams); 
  return (JSON.parse(replaceResponse.getContentText())).access_token;
}

const getSongs = function(_token, playlistId, playlistMarket){  
  const requestOptions = {
    method: 'GET',
    headers: {"Authorization": `Bearer ${_token}`},
    redirect: 'follow',
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=${playlistMarket}&fields=items(track(name%2Cartists(name)))`, requestOptions)

  return (JSON.parse(response)).items
}

const writeSongstoSheet = function(_headings, _songs){
  var outputRows = [];

  _songs.forEach(function(song) {
    outputRows.push(_headings.map(function(heading) {
      return song[heading] || '';
    }));
  });

  if (outputRows.length) {
    // Add the headings - delete this next line if headings not required
    outputRows.unshift(_headings);
    // Clear any previous content (quick n dirty way)
    SpreadsheetApp.getActiveSheet().getRange(1, 1, 2*outputRows.length, outputRows[0].length).clearContent();
    // Write new stuff
    SpreadsheetApp.getActiveSheet().getRange(1, 1, outputRows.length, outputRows[0].length).setValues(outputRows);
  }
}
  
function populateYoutubePlaylist() {  
  youtubePlaylistUrl = getCellText(13,6) // hardcoded location in sheet: F13
  var playlistId = getPlaylistIdFromUrl(youtubePlaylistUrl);

  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var data = sheet.getRange('A:B').getValues();

  for (var i = 1; i < data.length; i++) {
    var artist = data[i][0];
    var track = data[i][1]; 

    if (!artist || !track){
      break
    }
    
    addToPlaylist(playlistId, artist, track);
    Utilities.sleep(2000);
  }
}

function getPlaylistIdFromUrl(url) {
  var regex = /list=([^&]+)/;
  var match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error('Invalid playlist URL.');
  }
}

function addToPlaylist(playlistId, artist, track) {
  var videoId = getVideoId(artist, track);

  var youtubeService = YouTube;

  var playlistItem = {
    snippet: {
      playlistId: playlistId,
      resourceId: {
        kind: 'youtube#video',
        videoId: videoId
      }
    }
  };

  try {
    youtubeService.PlaylistItems.insert(playlistItem, 'snippet');
    Logger.log('Video added to playlist successfully.');
  } catch (error) {
    Logger.log('Error adding video to playlist: ' + error);
  }finally{
    Utilities.sleep(2000);
  }
}

function getVideoId(artist, track) {
  var query = artist + ' ' + track;
  var youtubeService = YouTube;
  var searchResponse = youtubeService.Search.list('id', {
    q: query,
    type: 'video',
    maxResults: 1,
  });
  Utilities.sleep(2000);

  if (searchResponse.items && searchResponse.items.length > 0) {
    var videoId = searchResponse.items[0].id.videoId;
    return videoId;
  } else {
    Logger.log('No video found for artist and track: ' + artist + ' - ' + track);
  } 
}
