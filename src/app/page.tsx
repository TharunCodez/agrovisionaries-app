'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf } from 'lucide-react';
import { useRole } from '@/contexts/role-context';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');
  const { setRole } = useRole();

  return (
    <div className="relative min-h-screen w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-center gap-3">
            <Leaf className="h-12 w-12 text-primary" />
            <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              Agro Visionaries
            </h1>
          </div>
          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Empowering farmers with smart technology for a sustainable future. Real-time data, intelligent alerts, and precise control, all in one place.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="font-bold" onClick={() => setRole('farmer')}>
              <Link href="/farmer/dashboard">Farmer Portal</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold" onClick={() => setRole('government')}>
              <Link href="/government/dashboard">Government Portal</Link>
            </Button>
          </div>
        </div>
      </div>
       <footer className="absolute bottom-0 left-0 right-0 z-10 p-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Agro Visionaries. All Rights Reserved.
      </footer>
    </div>
  );
}
