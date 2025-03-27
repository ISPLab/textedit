Эта страница представляет собой редактор HTML с двумя режимами просмотра. Вот основной функционал:
Загрузка файла
Есть кнопка для загрузки HTML файлов (.html, .htm)
При загрузке файла его содержимое отображается в редакторе
Два режима работы (переключаются кнопкой "Show Code"/"Preview HTML")
Preview режим (по умолчанию):
Отображает HTML в отрендеренном виде
Позволяет редактировать контент визуально через contentEditable
Изменения сразу отражаются в состоянии fileContent
Code режим:
Показывает HTML код в текстовом виде через textarea
Позволяет напрямую редактировать HTML разметку
Синхронизация контента
Изменения в любом режиме синхронизируются между режимами
При переключении режимов сохраняется последняя версия контента
Сохранение позиции курсора
Пытается сохранять позицию курсора при редактировании в Preview режиме
Использует useEffect для восстановления позиции после обновления DOM
Стилизация
Адаптивный дизайн
Поддержка темной темы
Стилизованные кнопки и поля ввода
Полноэкранный редактор с прокруткой
Основные технические особенности:
Использует React хуки (useState, useRef, useEffect)
Работает с DOM API для управления выделением текста
Использует FileReader для загрузки файлов
Реализована обработка ошибок при работе с DOM
Компонент работает на стороне клиента ("use client")

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
