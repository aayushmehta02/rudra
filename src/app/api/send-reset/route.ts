import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '';
console.log(JWT_SECRET);

export async function POST(req: Request) {
  try {
    const { email, username, userId } = await req.json();

    if (!email || !username || !userId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    
    const resetToken = jwt.sign(
      { userId, email, username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

   
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://rudra-aayush-mehtas-projects.vercel.app/'}/reset-password?token=${resetToken}`;

    return NextResponse.json({
      message: 'Token generated successfully',
      data: {
        resetUrl,
        username,
        email,
        userId
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { message: 'Failed to generate reset token' },
      { status: 500 }
    );
  }
} 