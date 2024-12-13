# Base Components

This directory contains the base components used throughout the application. These components are designed to be flexible, reusable, and consistent with the application's design system.

## Components

### BaseButton

A versatile button component that supports multiple variants, sizes, and states.

```tsx
<BaseButton
  variant="primary" // 'primary' | 'secondary' | 'danger' | 'ghost'
  size="md" // 'sm' | 'md' | 'lg'
  darkMode={true}
  icon={<Icon />}
  loading={false}
  disabled={false}
  fullWidth={false}
>
  Button Text
</BaseButton>
```

### BaseCard

A card component that can display content with a title, subtitle, actions, and expandable content.

```tsx
<BaseCard
  title="Card Title"
  subtitle="Optional subtitle"
  icon={<Icon />}
  isSelected={false}
  isExpandable={true}
  darkMode={true}
  onSelect={() => {}}
  onEdit={() => {}}
  onDelete={() => {}}
  actions={<CustomActions />}
  footer={<CustomFooter />}
>
  Card Content
</BaseCard>
```

### BaseList

A flexible list component that can render items in a grid or list layout.

```tsx
<BaseList
  items={items}
  renderItem={(item) => <CustomItem item={item} />}
  keyExtractor={(item) => item.id}
  layout="grid" // 'grid' | 'list'
  darkMode={true}
  loading={false}
  error={null}
  emptyMessage="No items found"
/>
```

### BaseForm Components

A collection of form components for building forms.

#### BaseForm

```tsx
<BaseForm
  darkMode={true}
  spacing="md" // 'sm' | 'md' | 'lg'
  padding={true}
  onSubmit={handleSubmit}
>
  Form Content
</BaseForm>
```

#### BaseFormField

```tsx
<BaseFormField
  label="Field Label"
  error="Error message"
  darkMode={true}
>
  <BaseFormInput />
</BaseFormField>
```

#### BaseFormInput

```tsx
<BaseFormInput
  type="text"
  value={value}
  onChange={handleChange}
  darkMode={true}
  placeholder="Enter value..."
/>
```

#### BaseFormTextArea

```tsx
<BaseFormTextArea
  value={value}
  onChange={handleChange}
  darkMode={true}
  rows={4}
  placeholder="Enter text..."
/>
```

#### BaseFormSelect

```tsx
<BaseFormSelect
  value={value}
  onChange={handleChange}
  darkMode={true}
>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</BaseFormSelect>
```

### BaseModal

A modal component for displaying content in an overlay.

```tsx
<BaseModal
  isOpen={true}
  onClose={() => {}}
  title="Modal Title"
  size="md" // 'sm' | 'md' | 'lg'
  darkMode={true}
>
  Modal Content
  <BaseModalActions align="right"> // 'left' | 'center' | 'right'
    <BaseButton>Cancel</BaseButton>
    <BaseButton>Confirm</BaseButton>
  </BaseModalActions>
</BaseModal>
```

## Theme System

The components use a consistent theme system defined in `src/constants/theme.ts`. The theme includes:

- Brand colors
- Semantic colors (success, warning, error, info)
- Light and dark mode variants
- Component-specific variants

### Usage with Dark Mode

All components accept a `darkMode` prop that toggles between light and dark themes:

```tsx
import { theme } from '@constants/theme';

function MyComponent({ darkMode }) {
  return (
    <div className={darkMode ? theme.dark.bg.primary : theme.light.bg.primary}>
      <BaseButton darkMode={darkMode}>
        Click Me
      </BaseButton>
    </div>
  );
}
```

## Best Practices

1. **Component Usage**
   - Always use base components instead of raw HTML elements
   - Pass the `darkMode` prop from your app's theme context
   - Use semantic variants (primary, secondary, etc.) consistently

2. **Styling**
   - Use the theme constants for colors and variants
   - Avoid inline styles
   - Use Tailwind classes for custom styling

3. **Accessibility**
   - Include proper ARIA labels
   - Ensure keyboard navigation works
   - Maintain proper contrast ratios

4. **Performance**
   - Memoize callbacks passed to components
   - Use keys properly in lists
   - Avoid unnecessary re-renders

## Contributing

When adding new components or modifying existing ones:

1. Update the types in `src/types/ui.ts`
2. Add appropriate theme variants in `src/constants/theme.ts`
3. Update this documentation
4. Add tests for new functionality
5. Ensure dark mode support
6. Follow the existing component patterns 