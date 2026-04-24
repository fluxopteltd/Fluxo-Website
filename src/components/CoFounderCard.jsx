
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function CoFounderCard({ name, role, bio, initials, colorClass, imageUrl }) {
  return (
    <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-sm hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 transition-all duration-400 group h-full flex flex-col">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
          
          <Avatar className="w-24 h-24 rounded-full shadow-md relative z-10 border-4 border-background bg-muted">
            {imageUrl && <AvatarImage src={imageUrl} alt={name} className="object-cover" />}
            <AvatarFallback className={`text-2xl font-bold ${colorClass}`}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-foreground tracking-tight">{name}</h3>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mt-2">{role}</p>
        </div>
      </div>
      <p className="text-lg text-muted-foreground leading-relaxed flex-1 font-medium">{bio}</p>
    </div>
  );
}

export default CoFounderCard;
