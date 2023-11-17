

class SongQueries:
    def get_songs(self):
        with poo.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    Select info here
                    """
                )
                songs = []
                rows = cur.fetchall()
                for row in rows:
                    song = songs.append(song)
                return songs
