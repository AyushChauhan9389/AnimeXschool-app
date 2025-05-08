import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTriggerProps,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/Dialog';
import { Button, ButtonText } from '@/components/ui/Button';
import { useDeleteAccountMutation } from '@/hooks/api/useAuth';
import { Spinner } from '@/components/ui/Spinner';

type DeleteAccountDialogProps = {
  triggerProps?: DialogTriggerProps;
};

/**
 * It will prompt the user to confirm their action and then delete their account
 */
const DeleteAccountDialog = ({ triggerProps }: DeleteAccountDialogProps) => {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteAccountMutation = useDeleteAccountMutation();

  const handleDeleteAccount = useCallback(() => {
    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        router.dismissTo('/account');
      },
    });
  }, [deleteAccountMutation, router]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      closeOnBackPress={false}
      closeOnPressOutside={false}
    >
      <DialogTrigger
        as={Button}
        variant="outline"
        color="red"
        children={<ButtonText>Delete Account</ButtonText>}
        {...triggerProps}
      />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? All of your data will
            be permanently removed. This action cannot be undone.
          </DialogDescription>

          <View style={styles.actions}>
            <DialogClose
              as={Button}
              variant="soft"
              color="neutral"
              fill
              disabled={deleteAccountMutation.isPending}
            >
              <ButtonText>Cancel</ButtonText>
            </DialogClose>
            <Button
              color="red"
              fill
              onPress={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
            >
              <Spinner
                loading={deleteAccountMutation.isPending}
                colorStep="8"
              />
              <ButtonText>Delete</ButtonText>
            </Button>
          </View>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const stylesheet = createStyleSheet(({ space }) => ({
  actions: {
    marginTop: space[12],
    width: '100%',
    flexDirection: 'row',
    gap: space[12],
  },
}));

export { DeleteAccountDialog };
export type { DeleteAccountDialogProps };
