
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { Palette } from 'lucide-react'; // Changed from Theme to Palette which exists in lucide-react

const ThemeSwitcher = () => {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-5 right-5 rounded-full h-10 w-10">
          <Palette size={18} /> {/* Changed from ThemeIcon to Palette */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Display</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-muted' : ''}>
          Light Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-muted' : ''}>
          Dark Mode
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => setColorTheme('default')}
          className={colorTheme === 'default' ? 'bg-muted' : ''}
        >
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          Green (Default)
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setColorTheme('purple')}
          className={colorTheme === 'purple' ? 'bg-muted' : ''}
        >
          <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
          Purple
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setColorTheme('blue')}
          className={colorTheme === 'blue' ? 'bg-muted' : ''}
        >
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          Blue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
