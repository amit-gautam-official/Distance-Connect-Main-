import { Suspense } from 'react';
import ChatComponent from './_components/ChatComponent';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-full items-center justify-center">
    <div className="loader">Loading...</div>
  </div>
);

export default function ChatPage() {
  return (
    <div>
      <Suspense fallback={<LoadingFallback />}>
        <ChatComponent />
      </Suspense>
    </div>
  );
}