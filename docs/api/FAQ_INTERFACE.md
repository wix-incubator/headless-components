# FAQ Components

Headless FAQ components with render props following the stores pattern.

## Usage

### Single FAQ

```tsx
import { Faq } from '@wix/faq/react';

<Faq.Root faq={faqEntry}>
  <Faq.Item>
    <Faq.Name />
    <Faq.Answer />
  </Faq.Item>
</Faq.Root>
```

### FAQ Categories List

```tsx
import { FaqCategories, FaqCategory, Faq } from '@wix/faq/react';

<FaqCategories.Root faqCategoriesConfig={config}>
  <FaqCategories.Categories>
    <FaqCategories.CategoryRepeater>
      <FaqCategory.Name />
      <FaqCategory.Faqs>
        <FaqCategory.FaqRepeater>
          <Faq.Item>
            <Faq.Name />
            <Faq.Answer />
          </Faq.Item>
        </FaqCategory.FaqRepeater>
      </FaqCategory.Faqs>
    </FaqCategories.CategoryRepeater>
  </FaqCategories.Categories>
</FaqCategories.Root>
```

## Customization

### With Custom Styling

```tsx
<Faq.Root faq={faq}>
  <Faq.Item className="border-b border-gray-200 pb-4">
    <Faq.Name className="text-xl font-bold text-gray-900" />
    <Faq.Answer className="mt-2 text-gray-600" />
  </Faq.Item>
</Faq.Root>
```

### With Custom Elements

```tsx
<Faq.Root faq={faq}>
  <Faq.Item asChild>
    <AccordionItem className="border-b border-white/10 last:border-b-0" />
  </Faq.Item>
  <Faq.Name asChild>
    <h3 className="faq-question" />
  </Faq.Name>
  <Faq.Answer asChild>
    <div className="faq-content" />
  </Faq.Answer>
</Faq.Root>
```

### With Custom Components

```tsx
<Faq.Root faq={faq}>
  <Faq.Item asChild>
    {React.forwardRef(({ id, ...props }, ref) => (
      <AccordionItem ref={ref} {...props} value={id}>
        <Faq.Name asChild>
          {React.forwardRef(({ question, ...props }, ref) => (
            <button ref={ref} {...props} className="accordion-trigger">
              Q: {question}
            </button>
          ))}
        </Faq.Name>
        <Faq.Answer asChild>
          {React.forwardRef(({ answer, ...props }, ref) => (
            <div ref={ref} {...props} className="accordion-content">
              A: {answer}
            </div>
          ))}
        </Faq.Answer>
      </AccordionItem>
    ))}
  </Faq.Item>
</Faq.Root>
```

### With Empty States

```tsx
<FaqCategories.Root faqCategoriesConfig={config}>
  <FaqCategories.Categories emptyState={<EmptyCategories />}>
    <FaqCategories.CategoryRepeater>
      <FaqCategory.Name />
      <FaqCategory.Faqs emptyState={<EmptyFaqs />}>
        <FaqCategory.FaqRepeater>
          <Faq.Item>
            <Faq.Name />
            <Faq.Answer />
          </Faq.Item>
        </FaqCategory.FaqRepeater>
      </FaqCategory.Faqs>
    </FaqCategories.CategoryRepeater>
  </FaqCategories.Categories>
</FaqCategories.Root>
```

## Core Components (Advanced)

Use core components for maximum control with render props:

```tsx
import { Faq } from '@wix/faq/core';

<Faq.Root faqServiceConfig={{ faqs: [faq], categoryId: 'cat-1' }}>
  <Faq.Name>
    {({ question }) => (
      <h3 className="custom-question">{question}</h3>
    )}
  </Faq.Name>
  <Faq.Answer>
    {({ answer }) => (
      <div className="custom-answer">{answer}</div>
    )}
  </Faq.Answer>
</Faq.Root>
```

## Props Reference

### Faq.Root
```tsx
interface FaqRootProps {
  faq: FaqEntry;
  children: React.ReactNode;
}
```

### Faq.Item
```tsx
interface FaqItemProps {
  asChild?: boolean;
  children?: AsChildChildren<{ id: string }>;
  className?: string;
}
```

### Faq.Name / Faq.Answer
```tsx
interface FaqComponentProps {
  asChild?: boolean;
  children?: AsChildChildren<{ question: string }> | AsChildChildren<{ answer: string }>;
  className?: string;
}
```

### FaqCategories.Root
```tsx
interface FaqCategoriesRootProps {
  faqCategoriesConfig: FaqCategoriesServiceConfig;
  children: React.ReactNode;
  className?: string;
}
```

### FaqCategory.Root
```tsx
interface FaqCategoryRootProps {
  category: FaqCategory;
  children: React.ReactNode;
  className?: string;
  faqConfig?: FaqServiceConfig;
}
```

### List Components
```tsx
interface ListProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

interface RepeaterProps {
  children: React.ReactNode;
}
```

## Data Types

### FaqEntry
```tsx
interface FaqEntry {
  _id?: string | null;
  question?: string | null;
  plainText?: string | null;
  draftjs?: string | null;
  categoryId?: string | null;
  sortOrder?: number | null;
  labels?: string[];
  visible?: boolean;
}
```

### FaqCategory
```tsx
interface FaqCategory {
  _id?: string;
  title?: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  sortOrder?: number;
  description?: string;
  visible?: boolean;
}
```

### Service Configs
```tsx
interface FaqServiceConfig {
  faqs: FaqEntry[];
  categoryId?: string | null;
}

interface FaqCategoriesServiceConfig {
  categories: FaqCategory[];
}
```

## Test IDs

Components include these `data-testid` attributes:

- `faq-root` - FAQ container
- `faq-item` - FAQ item wrapper (currently uses `faq-root`)
- `faq-name` - FAQ question
- `faq-answer` - FAQ answer
- `faq-categories-root` - Categories container
- `faq-categories` - Categories list
- `faq-category` - Single category
- `faq-category-root` - Category container
- `faq-category-name` - Category name
- `faq-category-faqs` - Category's FAQs list
- `faq-category-faq` - Single FAQ in category

## Architecture

```
FaqCategories.Root (Service Provider)
├── FaqCategories.Categories (List Container)
    └── FaqCategories.CategoryRepeater (Repeater)
        └── FaqCategory.Root (Entity + Service Provider)
            ├── FaqCategory.Name (Entity Display)
            └── FaqCategory.Faqs (List Container)
                └── FaqCategory.FaqRepeater (Repeater)
                    └── Faq.Root (Entity + Service Provider)
                        └── Faq.Item (Item Wrapper)
                            ├── Faq.Name (Entity Display)
                            └── Faq.Answer (Entity Display)
```

**Key Principles:**
- **Services Pattern**: WixServices manages reactive data
- **Core Delegation**: UI components delegate to core render props
- **No React Context**: Data flows through services, metadata through props
- **Composable**: Mix and match components as needed
