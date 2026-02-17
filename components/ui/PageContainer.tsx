import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl break-words">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-gray-500 break-words">{description}</p>
      )}
    </div>
  );
}
