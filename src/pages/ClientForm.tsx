import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientForm({ open, onOpenChange }: ClientFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Client added");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new wellness client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter client's full name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input id="address" placeholder="Enter client's address" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
            <Input id="dateOfBirth" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">
              Emergency Contact (Optional)
            </Label>
            <Input
              id="emergencyContact"
              placeholder="Emergency contact name and phone"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
