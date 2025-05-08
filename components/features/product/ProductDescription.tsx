import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { useStyles } from 'react-native-unistyles';
import { fontFamilies } from '@/styles/tokens';

type ProductDescriptionProps = {
  html: string;
};

const ProductDescription = ({ html }: ProductDescriptionProps) => {
  const { theme } = useStyles();

  const fontFamily = Object.values(fontFamilies).join(', ');
  const systemFonts = [
    ...defaultSystemFonts,
    fontFamilies.interRegular,
    fontFamilies.interMedium,
    fontFamilies.interSemiBold,
    fontFamilies.interBold,
  ];

  return (
    <RenderHtml
      source={{ html }}
      systemFonts={systemFonts}
      enableExperimentalMarginCollapsing
      ignoredStyles={['color']}
      ignoredDomTags={['a', 'button']}
      tagsStyles={{
        body: {
          color: theme.colors.neutral11,
          fontFamily: fontFamily,
          fontSize: theme.typography.fontSizes[14],
          lineHeight: 20,
        },
        ul: {
          marginBottom: theme.space[8],
        },
        ol: {
          marginBottom: theme.space[8],
        },
        a: {
          color: theme.colors.primary11,
        },
        li: {
          marginBottom: theme.space[4],
        },
      }}
    />
  );
};

export { ProductDescription };
export type { ProductDescriptionProps };
