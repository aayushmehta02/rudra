'use client';

import { Box } from '@mui/material';
import { StatCard } from '../common/StatCard';

interface StatsSectionProps {
  topCards: Array<{
    icon?: React.ReactNode;
    image?: string;
    title: string;
    value: string | number;
    width: { [key: string]: string };
    backgroundColor?: string;
  }>;
  bottomCards: Array<{
    image: string;
    title: string;
    value: string | number;
    width: { [key: string]: string };
  }>;
}

export default function StatsSection({ topCards, bottomCards }: StatsSectionProps) {
  return (
    <>
      {/* Top Cards Section */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: { xs: 1, sm: 2 }, 
        mb: { xs: 2, sm: 3 } 
      }}>
        {topCards.map((card, index) => (
          <StatCard
          key={index}
          image={card.image}
          title={card.title}
          value={String(card.value)}
          width={card.width}
          />
        ))}
      </Box>
      
      {/* Bottom Cards Section */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap', 
        gap: { xs: 1, sm: 2 },
        mb: { xs: 2, sm: 3 },
        alignItems: { xs: 'stretch', md: 'center' }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: { xs: 1, sm: 2 },
          width: { xs: '100%', md: '100%' }
        }}>
          {bottomCards.map((card, index) => (
            <StatCard
              key={index}
              image={card.image}
              title={card.title}
              value={String(card.value)}
              width={card.width}
            />
          ))}
        </Box>
      </Box>
    </>
  );
} 