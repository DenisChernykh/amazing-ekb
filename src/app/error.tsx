'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="container mx-auto p-4">
    <p>Не удалось загрузить данные. Попробуйте ещё раз.</p>
    <button className="mt-4 underline" onClick={reset}>Повторить</button>
  </div>;
}
