import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // callback to refresh list
}

const CreateLinkModal: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!originalUrl.trim()) {
      toast("Error", {
        description: "Please enter a valid URL",
        action: {
          label: "Retry",
          onClick: () => setLoading(false),
        },
      });
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/links/create", {
        originalUrl,
        customAlias: customAlias || undefined,
        password: password || undefined,
        expirationDate: expiryDate || undefined,
      });
      toast("Success", {
        description: "Short link created successfully!",
        action: {
          label: "View Links",
          onClick: () => onCreated(),
        },
      });
      setOriginalUrl("");
      setCustomAlias("");
      setPassword("");
      setExpiryDate("");
      onCreated(); // refresh dashboard list
      onClose();
    } catch {
      toast("Error", {
        description: "Failed to create link",
        action: {
          label: "Retry",
          onClick: () => setLoading(false),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900 space-y-4">
        <DialogHeader>
          <DialogTitle>Create New Short Link</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Original URL</Label>
            <Input
              placeholder="Enter your original URL..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Custom Alias (optional)</Label>
            <Input
              placeholder="e.g. my-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Password Protect (optional)</Label>
            <Input
              type="password"
              placeholder="Set a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Expiry Date (optional)</Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLinkModal;
