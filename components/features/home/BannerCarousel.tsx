import { AsyncBoundary } from '@/components/AsyncBoundary';
import Carousel, { CarouselItem } from '@/components/Carousel';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBanners } from '@/hooks/api/useProducts';

const bannerHeight = 200;

const BannerCarousel = () => {
  const { data, isLoading, error, refetch, isRefetching } = useBanners();

  const banners: CarouselItem[] =
    data?.map(item => ({
      url: item.tabletUrl,
      href: item.productId ? `/product/${item.productId}` : undefined,
    })) || [];

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      isRetrying={isRefetching}
      LoadingComponent={LoadingComponent}
    >
      <Carousel
        data={banners}
        imageHeight={bannerHeight}
        autoScrolling
        contentFit="cover"
      />
    </AsyncBoundary>
  );
};

const LoadingComponent = () => {
  return <Skeleton style={{ height: bannerHeight }} />;
};

export { BannerCarousel };
