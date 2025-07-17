import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Mail, Phone, Plus, Search, Loader2 } from "lucide-react";
import { ClientForm } from "@/pages/ClientForm";
import { useClients } from "@/hooks/useClients";

export function Clients() {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading, error } = useClients();

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  );

  const handleClientFormClose = (open: boolean) => {
    setIsClientFormOpen(open);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading clients...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Clients</h1>
        <p className="text-muted-foreground">
          Manage your wellness clients and their information.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Client Directory</span>
                </CardTitle>
                <CardDescription>
                  View and manage all your wellness clients
                </CardDescription>
              </div>
              <Button onClick={() => setIsClientFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {client.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredClients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? `No clients found matching "${searchTerm}"`
                    : "No clients found"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ClientForm
        open={isClientFormOpen}
        onOpenChange={handleClientFormClose}
      />
    </div>
  );
}
