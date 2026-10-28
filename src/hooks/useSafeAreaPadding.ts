import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../styles/theme";

export function useSafeAreaPadding() {
  const insets = useSafeAreaInsets();

  return {
    insets,
    headerStyle: { paddingTop: insets.top + spacing[6] },
    overlayHeaderStyle: { paddingTop: insets.top + spacing[3] },
    screenBottomStyle: { paddingBottom: insets.bottom + spacing[4] },
    floatingBottomStyle: { bottom: spacing[6] + insets.bottom },
  };
}
