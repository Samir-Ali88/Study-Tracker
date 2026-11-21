import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <p className="text-sm font-semibold text-primary">404</p>
          <CardTitle className="text-2xl">Page not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The address you opened does not exist in Study Tracker.
          </p>
          <Link to="/">
            <Button>Go back Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
