'use client';
import { Button, Card, Dialog, Flex, ThemeProvider } from '@sanity/ui';
import { buildTheme } from '@sanity/ui/theme';
import { AnnouncementProps, Flow, Progress, Text } from '@frigade/react';

export function SanityAnnouncement({ flowId, ...props }: AnnouncementProps) {
  return (
    <ThemeProvider theme={buildTheme()}>
      {/*TODO complaining?*/}
      <Flow as={null} flowId={flowId} {...props}>
        {({
          flow,
          handleDismiss,
          handlePrimary,
          handleSecondary,
          parentProps: { dismissible },
          step,
        }) => (
          <Dialog
            __unstable_autoFocus={false}
            header={step.title}
            id="dialog-example"
            onClose={
              dismissible
                ? () => {
                    // @ts-expect-error - handleDismiss expects an event to be passed to it
                    handleDismiss();
                  }
                : undefined
            }
            zOffset={1000}
          >
            <Flex
              direction="column"
              gap={4}
              paddingRight={4}
              paddingLeft={4}
              paddingBottom={4}
            >
              {step.imageUri && (
                <Card radius={4} overflow="hidden">
                  <img src={step.imageUri} />
                </Card>
              )}

              <Text.Body2>{step.subtitle}</Text.Body2>

              <Progress.Dots
                current={flow.getCurrentStepIndex() + 1}
                marginInline="auto"
                total={flow.getNumberOfAvailableSteps()}
              />

              <Flex direction="row" gap={3}>
                {step.primaryButton?.title && (
                  <Button
                    onClick={handlePrimary}
                    text={step.primaryButton.title}
                    tone="primary"
                    width="fill"
                  />
                )}
                {step.secondaryButton?.title && (
                  <Button
                    onClick={handleSecondary}
                    mode="ghost"
                    space={3}
                    text={step.secondaryButton.title}
                    width="fill"
                  />
                )}
              </Flex>
            </Flex>
          </Dialog>
        )}
      </Flow>
    </ThemeProvider>
  );
}
