import { PhoneField } from '@wix/headless-forms/react';

const Phone = ({ id }: { id: string }) => {
  return (
    <PhoneField id={id}>
      <PhoneField.Label className="text-foreground font-paragraph mb-2">
        <PhoneField.Label.Required />
      </PhoneField.Label>
      <div className="flex gap-2">
        <PhoneField.CountryCode
          asChild
          className="px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <PhoneField.Input
          asChild
          className="flex-1 px-4 py-2 bg-background text-foreground border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <PhoneField.Error className="text-destructive text-sm font-paragraph" />
    </PhoneField>
  );
};

export default Phone;
