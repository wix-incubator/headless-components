import React, { useState } from 'react';
import { CmsCollection } from '@wix/headless-cms/react';

interface CreateItemExampleProps {
  collectionId: string;
}

/**
 * Example component demonstrating the CmsCollection.CreateItemAction functionality.
 * Shows how to create new items in a CMS collection.
 */
export default function CreateItemExample({
  collectionId,
}: CreateItemExampleProps) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <CmsCollection.Root
      collection={{
        id: collectionId,
      }}
    >
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
              Create New Item
            </h1>
            <p className="font-paragraph text-foreground/70">
              Add a new item to the collection using the form below.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-lg bg-background border border-foreground/10 p-6 space-y-6">
            {/* Dish Name Input */}
            <div>
              <label
                htmlFor="dishName"
                className="font-paragraph block text-sm font-medium text-foreground mb-2"
              >
                Dish Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="dishName"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="Enter dish name"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 font-paragraph text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Price Input */}
            <div>
              <label
                htmlFor="price"
                className="font-paragraph block text-sm font-medium text-foreground mb-2"
              >
                Price <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 font-paragraph text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label
                htmlFor="description"
                className="font-paragraph block text-sm font-medium text-foreground mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter dish description"
                rows={3}
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 font-paragraph text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Ingredients Textarea */}
            <div>
              <label
                htmlFor="ingredients"
                className="font-paragraph block text-sm font-medium text-foreground mb-2"
              >
                Ingredients
              </label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter ingredients"
                rows={3}
                className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 font-paragraph text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="font-paragraph block text-sm font-medium text-foreground mb-2">
                Dietary Restrictions
              </label>
              <div className="space-y-2">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'].map(
                  (restriction) => (
                    <label key={restriction} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dietaryRestrictions.includes(restriction)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDietaryRestrictions([...dietaryRestrictions, restriction]);
                          } else {
                            setDietaryRestrictions(
                              dietaryRestrictions.filter((r) => r !== restriction)
                            );
                          }
                        }}
                        className="rounded border-foreground/20 text-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="font-paragraph text-sm text-foreground">
                        {restriction}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Availability Toggle */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded border-foreground/20 text-primary focus:ring-2 focus:ring-primary/20"
                />
                <span className="font-paragraph text-sm font-medium text-foreground">
                  Available for order
                </span>
              </label>
            </div>

            {/* Submit Button - Using asChild pattern for full control */}
            <CmsCollection.CreateItemAction asChild>
              {({ insertItemOrReference, disabled, isLoading, error }) => (
                <div>
                  <button
                    onClick={async () => {
                      if (!dishName.trim()) {
                        alert('Please enter a dish name');
                        return;
                      }
                      if (!price || parseFloat(price) <= 0) {
                        alert('Please enter a valid price');
                        return;
                      }

                      try {
                        const newItem = await insertItemOrReference({
                          itemData: {
                            dishName,
                            description,
                            ingredients,
                            price: parseFloat(price),
                            dietaryRestrictions,
                            isAvailable,
                          },
                        });

                        if (newItem) {
                          // Success! Clear form
                          setDishName('');
                          setDescription('');
                          setIngredients('');
                          setPrice('');
                          setDietaryRestrictions([]);
                          setIsAvailable(true);
                          alert('Dish created successfully!');
                        }
                      } catch (err) {
                        // Error is already set in the error signal
                        console.error('Failed to create item:', err);
                      }
                    }}
                    disabled={disabled || !dishName.trim() || !price}
                    className="w-full rounded-md bg-primary px-4 py-3 font-paragraph text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Creating Dish...' : 'Create Dish'}
                  </button>
                  {error && (
                    <p className="text-destructive mt-2 font-paragraph text-sm">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </CmsCollection.CreateItemAction>

            {/* Alternative: Simple button without form control */}
            <div className="pt-4 border-t border-foreground/10">
              <p className="font-paragraph text-sm text-foreground/70 mb-3">
                Or create a sample dish with default values:
              </p>
              <CmsCollection.CreateItemAction asChild>
                {({ insertItemOrReference, isLoading, error }) => (
                  <div>
                    <button
                      onClick={async () => {
                        try {
                          const newItem = await insertItemOrReference({
                            itemData: {
                              dishName: 'Sample Dish ' + Date.now(),
                              description:
                                'This is a sample dish created with the quick create button',
                              ingredients: 'Various ingredients',
                              price: 12.99,
                              dietaryRestrictions: ['Vegetarian'],
                              isAvailable: true,
                            },
                          });
                          if (newItem) {
                            alert('Sample dish created successfully!');
                          }
                        } catch (err) {
                          console.error('Failed to create sample dish:', err);
                        }
                      }}
                      disabled={isLoading}
                      className="w-full rounded-md bg-secondary px-4 py-2 font-paragraph text-sm font-medium text-secondary-foreground hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? 'Creating...' : 'Quick Create Sample Dish'}
                    </button>
                    {error && (
                      <p className="text-destructive mt-2 font-paragraph text-sm">
                        {error}
                      </p>
                    )}
                  </div>
                )}
              </CmsCollection.CreateItemAction>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h3 className="font-heading text-sm font-semibold text-primary mb-2">
              💡 Implementation Notes
            </h3>
            <ul className="font-paragraph text-sm text-foreground/70 space-y-1 list-disc list-inside">
              <li>
                The first button uses the <code className="text-primary">asChild</code>{' '}
                pattern for full control
              </li>
              <li>
                The second button shows a simple quick-create implementation
              </li>
              <li>Both methods support loading states and error handling</li>
              <li>Created items will appear in the collection immediately</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            <a
              href="/"
              className="font-paragraph text-sm text-primary hover:text-primary/80 underline"
            >
              ← Back to Collection
            </a>
          </div>
        </div>
      </div>
    </CmsCollection.Root>
  );
}
