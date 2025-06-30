import { NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET() {
  try {
    // Get recent movies (last 5 years)
    const currentYear = new Date().getFullYear();
    const { data: recentMovies, error: moviesError } = await supabase
      .from('movie_table')
      .select('Movie_Name, Release_Date')
      .gte('Release_Date', currentYear - 5)
      .order('Release_Date', { ascending: false })
      .limit(10);

    if (moviesError) {
      console.error('Error fetching recent movies:', moviesError);
    }

    // Get most active actors (actors with most movies)
    const { data: actorMovieCounts, error: actorsError } = await supabase
      .from('movie_table')
      .select('Actor_Name')
      .order('Actor_Name');

    if (actorsError) {
      console.error('Error fetching actor data:', actorsError);
    }

    // Count movies per actor
    const actorCounts = {};
    if (actorMovieCounts) {
      actorMovieCounts.forEach(row => {
        actorCounts[row.Actor_Name] = (actorCounts[row.Actor_Name] || 0) + 1;
      });
    }

    // Get top 10 most active actors
    const mostActiveActors = Object.entries(actorCounts)
      .map(([name, count]) => ({ Actor_Name: name, movie_count: count }))
      .sort((a, b) => b.movie_count - a.movie_count)
      .slice(0, 10);

    return NextResponse.json({
      recentMovies: recentMovies || [],
      mostActiveActors: mostActiveActors || []
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
