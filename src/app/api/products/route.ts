import { HttpStatusCode } from 'axios';  
import connectMongo from '@/util/connect-mongo';  
import Product from '@/model/product';  
import {ProductsInterface} from '@/interface/product';  
import { NextRequest, NextResponse } from 'next/server';  
  
export async function POST(req: NextRequest) {  
    try {  
        await connectMongo();  
        const body: ProductsInterface = await req.json();  
        if (body.name) {  
            const product = await Product.create(body);  
            return NextResponse.json(  
                { product, message: 'Your product has been created' },  
                { status: HttpStatusCode.Created },  
            );  
        }  
        return NextResponse.json({ message: 'Product name is missing' }, { status: HttpStatusCode.BadRequest });  
    } catch (error) {  
        return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });  
    }  
}  
export async function GET() {  
    try {  
        await connectMongo();  
        const products = await Product.find();  
        return NextResponse.json({ data: products });  
    } catch (error) {  
        return NextResponse.json({ error });  
    }  
}
