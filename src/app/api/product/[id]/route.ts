import { NextRequest, NextResponse } from 'next/server';  
import connectMongo from '@/util/connect-mongo';  
import Product from '@/model/product';  
import { HttpStatusCode } from 'axios';  
import { ProductsInterface } from '@/interface/product';  
  
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {  
    try {  
        await connectMongo();  
        const product = await Product.findById(params.id);  
        if (product) {  
            return NextResponse.json({ product });  
        }  
        return NextResponse.json({ message: `Product ${params.id} not found` }, { status: HttpStatusCode.NotFound });  
    } catch (error) {  
        return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });  
    }  
}  
  
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {  
    try {  
        await connectMongo();  
        const product = await Product.findById(params.id);  
        if (product) {  
            const body: ProductsInterface = await req.json();  
            if (body.name) {  
                product.name = body.name;  
            }  
            if (body.price) {  
                product.name = body.price;  
            }  
            if (body.description) {  
                product.name = body.description;  
            }  
            product.save();  
            return NextResponse.json({ product });  
        }  
        return NextResponse.json({ message: `Product ${params.id} not found` }, { status: HttpStatusCode.NotFound });  
    } catch (error) {  
        return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });  
    }  
}  
  
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {  
    try {  
        await connectMongo();  
        const product = await Product.findById(params.id);  
        if (product) {  
            await Product.findByIdAndDelete(product._id);  
            return NextResponse.json({ message: `Product ${params.id} has been deleted` });  
        }  
        return NextResponse.json({ message: `Product ${params.id} not found` }, { status: HttpStatusCode.NotFound });  
    } catch (error) {  
        return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });  
    }  
}
