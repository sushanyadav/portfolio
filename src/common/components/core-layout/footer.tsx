export function Footer() {
  return (
    <footer className="h-20 shrink-0 bg-gray-100">
      <div className="container flex justify-center py-7">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Example. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
