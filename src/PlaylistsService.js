const { Pool } = require("pg");

class PlaylistsService {
    constructor() {
      this._pool = new Pool();
  }

  async getSongsOnPlaylist(playlistId) {
    const query = {
        text: `SELECT playlists.id as playlists_id, playlists.name, 
        songs.id, songs.title, songs.performer 
        FROM playlist_songs 
        RIGHT JOIN songs ON playlist_songs.song_id = songs.id
        RIGHT JOIN playlists ON playlists.id = playlist_songs.playlist_id
        WHERE playlist_songs.playlist_id = $1`,
        values: [playlistId],
    };
    const { rows, rowCount } = await this._pool.query(query);
    if(!rowCount){
        throw new Error('Playlist dan lagunnya tidak ditemukan');
    }
    const { playlists_id: id, name } = rows[0];

    const songs = rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }));

    if (songs[0].id === null) {
      return {
        playlist: {
          id,
          name,
          songs: [],
        }
      };
    }

    return {
      playlist: {
        id,
        name,
        songs,
      }
    };
  }
}

module.exports = PlaylistsService;