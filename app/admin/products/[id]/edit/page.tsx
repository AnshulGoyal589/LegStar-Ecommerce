import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { Loader2 } from "lucide-react"
import EditProductForm from "./EditProductForm"
import { getProductById } from "@/lib/db/products";
import { getCategories } from "@/lib/db/categories";

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number;
    images: string[];
    category: string;
    subcategory: string;
    gender: "men" | "women" | "kids";
    sizes: string[];
    colors: { name: string; hex: string }[];
    stock: number;
    rating: number;
    reviews: number;
    isFeatured: boolean;
    badge?: string;
    createdAt: Date;
    updatedAt: Date;
    sku?: string;
    barcode?: string;
    costPerItem?: number;
    isTaxable?: boolean;
    tags?: string[];
    brand?: string;
    status?: "active" | "draft" | "archived";
    variantsData?: { size: string; color: string; stock: number; price: number }[];
    seo?: { title?: string; description?: string };
}

async function ProductLoader({ productId }: { productId: string }) {
  
    const [product, allCategories] = await Promise.all([
        getProductById(productId),
        getCategories(),
    ]);

    if (!product) {
        notFound();
    }
    const serializedProduct = JSON.parse(JSON.stringify(product));
    const serializedCategories = JSON.parse(JSON.stringify(allCategories));

    return <EditProductForm initialProduct={serializedProduct} allCategories={serializedCategories} />;
}

export default async function EditProductPage({ params }: { params: Promise<{ id:string }> }) {
    const { id } = await params;
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Loading Product...</p>
            </div>
        }>
            <ProductLoader productId={id} />
        </Suspense>
    );
}