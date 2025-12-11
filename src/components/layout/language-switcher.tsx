'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'sk', name: 'Sikkimese' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLocaleChange = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
  };

  const selectedLanguageCode = i18n.language || 'en';
  // Handle cases like 'en-US' by taking the first part
  const baseLanguageCode = selectedLanguageCode.split('-')[0];
  const selectedLanguage = languages.find(lang => lang.code === baseLanguageCode) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => handleLocaleChange(lang.code)}
            className={selectedLanguage.code === lang.code ? 'bg-accent' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
