/**
 * Author: Libra
 * Date: 2024-09-26 17:11:38
 * LastEditors: Libra
 * Description:
 */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LogoutDialog = ({
  isOpen,
  setIsOpen,
  onConfirm,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
        </DialogHeader>
        <div>
          <p>Are you sure you want to logout?</p>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              setIsOpen(false);
            }}
          >
            Logout
          </Button>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
