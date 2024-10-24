// app/api/addUser/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/util/connect-mongo';
import User from '@/model/user';

interface UserRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body: UserRequestBody = await req.json();

    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Return the created user (excluding the password)
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: newUser._id, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
