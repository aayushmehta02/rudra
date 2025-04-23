import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({
        valid: false,
        message: 'No token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return NextResponse.json({
        valid: true,
        decoded
      });
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return NextResponse.json({
          valid: false,
          message: 'Reset link has expired. Please request a new one.'
        });
      }
      return NextResponse.json({
        valid: false,
        message: 'Invalid reset link. Please request a new one.'
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({
      valid: false,
      message: 'An error occurred while verifying the token'
    }, { status: 500 });
  }
} 