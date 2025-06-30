import { NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieName = searchParams.get('name');

    if (!movieName) {
      return NextResponse.json({ error: 'Movie name is required' }, { status: 400 });
    }

    // Get movie details and actors
    const { data: movieData, error: movieError } = await supabase
      .from('movie_table')
      .select('*')
      .ilike('Movie_Name', `%${movieName}%`)
      .order('Release_Date', { ascending: false });

    if (movieError) {
      console.error('Error fetching movie data:', movieError);
      return NextResponse.json({ error: movieError.message }, { status: 500 });
    }

    // Group actors by movie (in case there are multiple entries for the same movie)
    const movieGroups = {};
    if (movieData) {
      movieData.forEach(row => {
        if (!movieGroups[row.Movie_Name]) {
          movieGroups[row.Movie_Name] = {
            Movie_Name: row.Movie_Name,
            Release_Date: row.Release_Date,
            actors: []
          };
        }
        if (row.Actor_Name && !movieGroups[row.Movie_Name].actors.some(actor => actor.Actor_Name === row.Actor_Name)) {
          movieGroups[row.Movie_Name].actors.push({
            Actor_Id: row.Actor_Id,
            Actor_Name: row.Actor_Name
          });
        }
      });
    }

    const movies = Object.values(movieGroups);

    return NextResponse.json({
      movies: movies || []
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
