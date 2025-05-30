import withered from '@/assets/withered.png';

export default function NotFoundPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full w-full items-center justify-center px-6">
        <img className="m-8 w-[175px]" src={withered} alt="🥀"/>
        <div className="text-center">
          <h1 className="text-8xl font-extrabold tracking-tight">404</h1>
          <p className="mt-4 text-2xl">Page Not Found</p>
          <p className="mt-2">The page you're looking for does not exist.</p>
        </div>
      </div>
    </div>
  );
}