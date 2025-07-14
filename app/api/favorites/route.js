import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET - Fetch user's favorites
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('starsearch');
    const favorites = db.collection('favorites');

    const userFavorites = await favorites.find({ username }).toArray();
    
    return NextResponse.json({ favorites: userFavorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add to favorites
export async function POST(request) {
  try {
    const { username, type, itemId, itemName } = await request.json();
    
    if (!username || !type || !itemId || !itemName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('starsearch');
    const favorites = db.collection('favorites');

    // Check if already favorited
    const existingFavorite = await favorites.findOne({
      username,
      type,
      itemId
    });

    if (existingFavorite) {
      return NextResponse.json({ error: 'Already in favorites' }, { status: 409 });
    }

    // Add to favorites
    const result = await favorites.insertOne({
      username,
      type,
      itemId,
      itemName,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Added to favorites',
      favoriteId: result.insertedId 
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove from favorites
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const type = searchParams.get('type');
    const itemId = searchParams.get('itemId');
    
    if (!username || !type || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('starsearch');
    const favorites = db.collection('favorites');

    // Remove all favorites of this type and itemId for this user
    const result = await favorites.deleteMany({
      username,
      type,
      itemId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Removed from favorites',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
