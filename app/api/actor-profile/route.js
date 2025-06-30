import { NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const actorName = searchParams.get('name');

    if (!actorName) {
      return NextResponse.json({ error: 'Actor name is required' }, { status: 400 });
    }

    // Get actor details
    const { data: actorDetails, error: actorError } = await supabase
      .from('actor_details')
      .select('*')
      .ilike('Name', `%${actorName}%`)
      .limit(1);

    if (actorError) {
      console.error('Error fetching actor details:', actorError);
    }

    // Get actor movies
    const { data: movies, error: moviesError } = await supabase
      .from('movie_table')
      .select('*')
      .ilike('Actor_Name', `%${actorName}%`)
      .order('Release_Date', { ascending: false });

    if (moviesError) {
      console.error('Error fetching actor movies:', moviesError);
    }

    // Get actor education
    let education = [];
    if (actorDetails && actorDetails.length > 0) {
      const { data: eduData, error: eduError } = await supabase
        .from('celeb_edu')
        .select(`
          *,
          school_table (
            School_Name,
            Location,
            School_Type,
            Established_Year,
            School_Website
          )
        `)
        .eq('Actor_ID', actorDetails[0].ID);

      if (eduError) {
        console.error('Error fetching education:', eduError);
      } else {
        education = eduData || [];
      }
    }

    // Get social media accounts
    const { data: socialMedia, error: socialError } = await supabase
      .from('social_media_accounts')
      .select('*')
      .ilike('actor_name', `%${actorName}%`);

    if (socialError) {
      console.error('Error fetching social media:', socialError);
    }

    return NextResponse.json({
      actor: actorDetails?.[0] || null,
      movies: movies || [],
      education: education || [],
      socialMedia: socialMedia || []
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
