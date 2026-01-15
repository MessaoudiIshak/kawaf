import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface DecodedToken {
  role: Role;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthStatus {
  isAuth: boolean;
  role: Role | 'none';
}

export async function getAuthStatus(request: NextRequest): Promise<AuthStatus> {
  const authHeader = request.headers.get('authorization');
  const JWT_SECRET = process.env.JWT_SECRET_KEY || 'fallback_secret';

  const noneState: AuthStatus = {
    isAuth: false,
    role: 'none',
  };

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return noneState;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Cast the verification result to our DecodedToken interface
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    return {
      isAuth: true,
      role: decoded.role, 
    };
  } catch (error) {
    return noneState;
  }
}